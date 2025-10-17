import { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './PlayerMain.css';
import MyButton from '../MyButton/MyButton';
import MyLabel from '../MyLabel/MyLabel';
import { ServiceContext } from '../../ServiceContext';
import { useNetworkStatus } from '../../NetworkContext';

function PlayerMain(props) {
  const { playerService, teamService } = useContext(ServiceContext);
  const { isOnline, isServerUp } = useNetworkStatus();
  const navigate = useNavigate();
  const { team, player } = props;
  const [imageSrc, setImageSrc] = useState('default-image.png');

  useEffect(() => {
    if (team && team.image) {
      setImageSrc(team.image);
    }
  }, [team]);

  if (!player || !team) {
    return <div>Loading...</div>;
  }

  const editPlayer = () => {
    navigate(`/editPlayer/${team.id}/${player.id}`, { state: { team, player } });
  };

  const handleImageError = () => {
    setImageSrc('default-image.png'); // Set to your default image file name
  };

  const deletePlayer = async () => {
    const shouldUseOffline = !isOnline || !isServerUp;

    if (shouldUseOffline) {
      // Queue update operation
      const queuedUpdates = JSON.parse(localStorage.getItem("pendingUpdates") || "[]");
      queuedUpdates.push({ type: "delete", teamId: team.id, playerId: player.id});
      localStorage.setItem("pendingUpdates", JSON.stringify(queuedUpdates));
  
      alert("Player will be deleted after connection is established!");
      navigate(`/myleague`);
      return;
    }

    try {
      const deletedPlayer = await playerService.removePlayer(player.id);

      console.log(deletedPlayer);
      alert('Deleted player successfully!');
      navigate(-1);
    } 
    catch (error) {
      console.error('Error deleting player:', error);

      if (error.response?.status === 400) {
        alert("Bad request!")
      } 
      else if (error.response?.status === 403){
        alert("You are not allowed to delete this player!")
      }
      else if (error.response?.status === 404){
        alert("Player not found!");
      }
      else {
        alert("Failed to update player.");
      }
    }
  };

  return (
    <div className="player-main-container" style={props.style}>
      <div className="player-manage">
        {!isOnline && <div className="offline-warning">⚠️ You are offline</div>}
        {isOnline && !isServerUp && <div className="offline-warning">⚠️ Server is unavailable</div>}
        <div className="player-image-box">
          <img
              src={require(`../../resources/${imageSrc}`)} // Dynamically load image
              onError={handleImageError} // Fallback to default if image not found
              style={{objectFit: 'contain', width: '80%', height: 'auto'}} 
              alt="Team Logo"
          ></img>
        </div>
        <div className="player-buttons">
          <MyButton text="Edit" onClick={editPlayer} />
          <MyButton text="Delete" onClick={deletePlayer} />
        </div>
      </div>

      <div className="player-attributes">
        <div className="row-attributes">
          <MyLabel text={player.name} style={{ width: '22vw', height: '6vh' }} />
          <MyLabel text={`#${player.number}`} style={{ width: '4vw', height: '5vh' }} />
          <MyLabel text={player.position} style={{ width: '4vw', height: '5vh' }} />
        </div>

        <div className="row-attributes">
          <MyLabel text={`Age: ${player.age}`} style={{ width: '15vw', height: '5vh' }} />
          <MyLabel text={`Experience: ${player.experience}`} style={{ width: '15vw', height: '5vh' }} />
        </div>

        <div className="row-attributes">
          <MyLabel text={`Height: ${player.height}cm`} style={{ width: '15vw', height: '5vh' }} />
          <MyLabel text={`Weight: ${player.weight}kg`} style={{ width: '15vw', height: '5vh' }} />
        </div>
      </div>
    </div>
  );
}

export default PlayerMain;
