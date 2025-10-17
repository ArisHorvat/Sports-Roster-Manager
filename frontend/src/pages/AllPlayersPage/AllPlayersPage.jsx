import './AllPlayersPage.css';
import AllPlayersMain from '../../components/AllPlayersMain/AllPlayersMain';
import PlayerHeader from '../../components/PlayerHeader/PlayerHeader';


function AllPlayersPage() {
  return (
    <div className="league-page">
        <PlayerHeader text="All Players"/>
        <AllPlayersMain/>
    </div>
  );
}

export default AllPlayersPage;
