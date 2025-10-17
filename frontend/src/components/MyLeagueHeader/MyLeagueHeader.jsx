import './MyLeagueHeader.css';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { FaAngleLeft, FaChevronCircleLeft, FaChevronCircleRight} from "react-icons/fa";
import Title from '../../components/Title/Title'
import User from '../../components/User/User';


function MyLeagueHeader(props) {
  const navigate = useNavigate();
  const [imageSrc, setImageSrc] = useState(props.team.image);

  const navigateBack = () => {
    navigate(`/home`);
  }

  const handleImageError = () => {
    setImageSrc('default-image.png'); // Set to your default image file name
  };

  const currentTeam = props.team;
  const handlePrev = props.onPrev;
  const handleNext = props.onNext;

  return (
    <div className="header">
        <div className="back-container">
            <FaAngleLeft style={{ stroke: '#fff', strokeWidth: '1vw', fill: '#000', fontSize: '5.2vw', cursor: 'pointer'}} onClick={navigateBack}/>
        </div>
        
        <div className="image-box-team">
            <img
              src={require(`../../resources/${imageSrc}`)} // Dynamically load image
              onError={handleImageError} // Fallback to default if image not found
              style={{objectFit: 'contain', width: '80%', height: 'auto'}} 
              alt="Team Logo"
            ></img>
        </div>

        {/* Navigate through teams */}
        <div className="navigate-container">
            <FaChevronCircleLeft onClick={handlePrev} style={{ stroke: '#000000', strokeWidth: '1.2vw', fill: '#2c2c2c', fontSize: '4vw', cursor: 'pointer' }} />
        </div>
        <Title text={currentTeam.teamName} size="3vw"/>
        <div className="navigate-container">
            <FaChevronCircleRight onClick={handleNext} style={{ stroke: '#000000', strokeWidth: '1.2vw', fill: '#2c2c2c', fontSize: '4vw', cursor: 'pointer' }} />
        </div>

        <User/>
    </div>
  );
}

export default MyLeagueHeader;
