import { useNavigate } from 'react-router-dom';
import { useState, useContext } from 'react';
import Select from 'react-select';

import './EditPlayerMain.css';
import MyButton from '../MyButton/MyButton';
import MyInput from '../MyInput/MyInput';
import { ServiceContext } from '../../ServiceContext';
import { useNetworkStatus } from '../../NetworkContext';

function EditPlayerMain(props) {
  const { playerService } = useContext(ServiceContext);
  const { isOnline, isServerUp } = useNetworkStatus();
  const navigate = useNavigate();
  const { team, player } = props;
  const [imageSrc, setImageSrc] = useState(props.team.image);

  const [selectedPosition, setSelectedPosition] = useState(player.position);
  const [name, setName] = useState(player.name || "");
  const [number, setNumber] = useState(player.number?.toString() || "");
  const [age, setAge] = useState(player.age?.toString() || "");
  const [experience, setExperience] = useState(player.experience?.toString() || "");
  const [height, setHeight] = useState(player.height?.toString() || "");
  const [weight, setWeight] = useState(player.weight?.toString() || "");
  const [errors, setErrors] = useState({});

  if (!player || !team) {
    return <div>Loading...</div>;
  }

  const positionOptions = [
    { value: 'QB', label: 'QB' },
    { value: 'RB', label: 'RB' },
    { value: 'WR', label: 'WR' },
    { value: 'TE', label: 'TE' },
    { value: 'OL', label: 'OL' },
    { value: 'DL', label: 'DL' },
    { value: 'LB', label: 'LB' },
    { value: 'DB', label: 'DB' },
    { value: 'ST', label: 'ST' },
  ];

  const goBack = () => navigate(-1);

  const customStyles = {
    control: (provided, state) => ({
      ...provided,
      width: '12vw',
      height: '5vh',
      backgroundColor: '#ffffff',
      borderColor: state.isFocused ? '#2c2c2c' : '#a4a4a4',
      boxShadow: state.isFocused ? '2c2c2c' : 'a4a4a4',
      '&:hover': { borderColor: '#2c2c2c' },
      color: '#fff',
      padding: '0.1vh 0.1vw',
      fontFamily: 'Jersey 25',
      fontSize: '1.2vw',
    }),
    singleValue: (provided) => ({
      ...provided,
      color: '#000000',
    }),
    menu: (provided) => ({
      ...provided,
      backgroundColor: '#2c2c2c',
      maxHeight: '16vh',
      overflowY: 'auto',
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isFocused ? '#000000' : '#2c2c2c',
      color: '#fff',
      cursor: 'pointer',
    }),
  };

  const handleFinish = async () => {
    const shouldUseOffline = !isOnline || !isServerUp;

    const playerData = {
      playerId: player.id,
      name,
      number: parseInt(number),
      position: selectedPosition,
      age: parseInt(age),
      experience: parseInt(experience),
      height: parseInt(height),
      weight: parseInt(weight),
      teamId: team.id
    };

    if (shouldUseOffline) {
      // Queue update operation
      const queuedUpdates = JSON.parse(localStorage.getItem("pendingUpdates") || "[]");
      queuedUpdates.push({ type: "update", playerData });
      localStorage.setItem("pendingUpdates", JSON.stringify(queuedUpdates));
  
      alert("Player will update after connection is established!");
      navigate(`/myleague`);
      return;
    }

    try {
      const updatedPlayer = await playerService.updatePlayer(playerData);
      alert("Updated player successfully!");
      navigate(`/myleague`);
    } 
    catch (error) {
      console.error('Error updating player:', error);

      if (error.response?.status === 400 && error.response.data?.errors) {
        setErrors(error.response.data.errors); // Set specific field errors
      } 
      else if (error.response?.status === 403){
        setErrors({});
        alert("You are not allowed to edit this player!")
      }
      else if (error.response?.status === 404){
        setErrors({});
        alert("Player not found!");
      }
      else {
        setErrors({});
        alert("Failed to update player.");
      }
    }
  };

  const handleImageError = () => {
    setImageSrc('default-image.png'); // Set to your default image file name
  };

  return (
    <div className="edit-player-main-container" style={props.style}>
      <div className="edit-player-manage">
        {!isOnline && <div className="offline-warning">⚠️ You are offline</div>}
        {isOnline && !isServerUp && <div className="offline-warning">⚠️ Server is unavailable</div>}
        <div className="edit-player-image-box">
          <img
              src={require(`../../resources/${imageSrc}`)} // Dynamically load image
              onError={handleImageError} // Fallback to default if image not found
              style={{objectFit: 'contain', width: '80%', height: 'auto'}} 
              alt="Team Logo"
          ></img>
        </div>
        <div className="edit-player-buttons">
          <MyButton text="Finish" onClick={handleFinish} />
          <MyButton text="Cancel" onClick={goBack} />
        </div>
      </div>

      <div className="edit-player-attributes">
        <div className="edit-row-attributes">
          <div className="edit-input-container">
            {errors.name && <span className="error-message">{errors.name}</span>}
            <MyInput
              text="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={{ width: '15vw', height: '5vh', borderColor: errors.name ? 'red' : '#a4a4a4' }}
            />
          </div>
          <div className="edit-input-container">
            {errors.number && <span className="error-message">{errors.number}</span>}
            <MyInput
              text="Number"
              value={number}
              onChange={(e) => setNumber(e.target.value)}
              style={{ width: '15vw', height: '5vh', borderColor: errors.number ? 'red' : '#a4a4a4' }}
            />
          </div>
        </div>

        <div className="edit-row-attributes">
          <div className="edit-input-container">
            {errors.age && <span className="error-message">{errors.age}</span>}
            <MyInput
              text="Age"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              style={{ width: '15vw', height: '5vh', borderColor: errors.age ? 'red' : '#a4a4a4' }}
            />
          </div>
          <div className="edit-input-container">
            {errors.experience && <span className="error-message">{errors.experience}</span>}
            <MyInput
              text="Experience"
              value={experience}
              onChange={(e) => setExperience(e.target.value)}
              style={{ width: '15vw', height: '5vh', borderColor: errors.experience ? 'red' : '#a4a4a4' }}
            />
          </div>
        </div>

        <div className="edit-row-attributes">
          <div className="edit-input-container">
            {errors.height && <span className="error-message">{errors.height}</span>}
            <MyInput
              text="Height"
              value={height}
              onChange={(e) => setHeight(e.target.value)}
              style={{ width: '15vw', height: '5vh', borderColor: errors.height ? 'red' : '#a4a4a4' }}
            />
          </div>
          <div className="edit-input-container">
            {errors.weight && <span className="error-message">{errors.weight}</span>}
            <MyInput
              text="Weight"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              style={{ width: '15vw', height: '5vh', borderColor: errors.weight ? 'red' : '#a4a4a4' }}
            />
          </div>
        </div>

        <div className="edit-row-attributes">
          <div className="select-attribute-container">
            <div className="edit-input-container">
              {errors.position && <span className="error-message">{errors.position}</span>}
              <h1>Position</h1>
              <Select
                options={positionOptions}
                value={positionOptions.find(option => option.value === selectedPosition)}
                onChange={(selectedOption) => setSelectedPosition(selectedOption.value)}
                styles={customStyles}
                className="select"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EditPlayerMain;
