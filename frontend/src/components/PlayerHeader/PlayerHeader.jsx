import './PlayerHeader.css';
import { useNavigate } from 'react-router-dom';
import { FaAngleLeft } from 'react-icons/fa';
import Title from '../Title/Title'
import User from '../User/User';


function PlayerHeader(props) {
  const navigate = useNavigate();

  const goBack = () => {
    navigate(-1);
  };

  return (
    <div className="player-header">
      <div className="back-container">
        <FaAngleLeft style={{ stroke: '#fff', strokeWidth: '1vw', fill: '#000', fontSize: '5.2vw', cursor: 'pointer'}} onClick={goBack}/>
      </div>
      <Title text={props.text} size="4vw"/>
      <User/>
    </div>
  );
}

export default PlayerHeader;
