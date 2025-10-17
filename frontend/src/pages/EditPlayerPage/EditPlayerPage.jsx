import './EditPlayerPage.css';
import { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';

import PlayerHeader from '../../components/PlayerHeader/PlayerHeader';
import EditPlayerMain from '../../components/EditPlayerMain/EditPlayerMain';
import { ServiceContext } from '../../ServiceContext';

function EditPlayerPage() {
  const { playerService, teamService } = useContext(ServiceContext);
  const { teamId, playerId } = useParams();
  const [team, setTeam] = useState(null);
  const [player, setPlayer] = useState(null);
  const [loading, setLoading] = useState(true); // Add loading state

  const fetchData = async () => {
    try {
      const player = await playerService.getPlayerById(playerId);
      setPlayer(player);

      const team = await teamService.getTeamById(teamId);
      setTeam(team);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false); // Set loading to false after the fetch is done
    }
  };

  useEffect(() => {
    fetchData();
  }, [teamId, playerId]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="home-page">
      <PlayerHeader text="My Lab" />
      <EditPlayerMain team={team} player={player} />
    </div>
  );
}

export default EditPlayerPage;
