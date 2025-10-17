import './MyLabPage.css';
import { useParams } from 'react-router-dom';

import PlayerHeader from '../../components/PlayerHeader/PlayerHeader';
import MyLabMain from '../../components/MyLabMain/MyLabMain';


function MyLabPage() {
  const { teamId } = useParams();

  return (
    <div className="home-page">
        <PlayerHeader text="My Lab"/>
        <MyLabMain teamId={teamId}/>
    </div>
  );
}

export default MyLabPage;
