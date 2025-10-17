import './HomeHeader.css';
import Title from '../../components/Title/Title'
import User from '../../components/User/User';


function HomeHeader() {
  return (
    <div className="header">
        <div className="empty-container"></div>
        <Title text="NFL ROSTER MANAGER" size="3vw"/>
        <User/>
    </div>
  );
}

export default HomeHeader;
