import {useNavigate} from 'react-router-dom';
import { useState } from 'react';

import './HomeMain.css';
import MyButton from '../MyButton/MyButton';


function HomeMain(props) {
  const team  = props.team;
  const [imageSrc, setImageSrc] = useState(props.team.image);

  const navigate = useNavigate();

  const goToMyLeague = () => {
    navigate('/myleague')
  }

  const goToMyLab = () => {
    navigate(`/mylab/${props.teamId}`)
  }

  const goToAllPlayers = () => {
    navigate(`/allplayers`)
  }

  const goToFiles = () => {
    navigate(`/files`)
  }

  const goToAdmin = () => {
    navigate(`/admin`)
  }

  const handleImageError = () => {
    setImageSrc('default-image.png'); // Set to your default image file name
  };

  return (
    <div className="home-main-container" style={props.style}>
      <div className='home-main-row'>
        <MyButton text="My League" onClick={goToMyLeague}/>

        <div className="image-box">
          <img
              src={require(`../../resources/${imageSrc}`)} // Dynamically load image
              onError={handleImageError} // Fallback to default if image not found
              style={{objectFit: 'contain', width: '80%', height: 'auto'}} 
              alt="Team Logo"
            ></img>
        </div>

        <MyButton text="My Lab" onClick={goToMyLab}/>
      </div>

      <div className='home-main-row'>
        <MyButton text="Admin" onClick={goToAdmin}/>
        <MyButton text="All Players" onClick={goToAllPlayers}/>
        <MyButton text="Files" onClick={goToFiles}/>
      </div>
    </div>
  );
}

export default HomeMain;
