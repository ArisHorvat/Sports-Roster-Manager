import './PlayerCard.css';
import { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';

import PlayerHeader from '../../components/PlayerHeader/PlayerHeader';
import PlayerMain from '../../components/PlayerMain/PlayerMain';
import { ServiceContext } from '../../ServiceContext';

function PlayerCard() {
  const { playerService, teamService } = useContext(ServiceContext);
  const { teamId, playerId } = useParams();
  const [team, setTeam] = useState(null);
  const [player, setPlayer] = useState(null);

  const fetchData = async () => {
    try {
      const player = await playerService.getPlayerById(playerId);
      setPlayer(player);

      const team = await teamService.getTeamById(teamId);
      setTeam(team);

    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [teamId, playerId]);

  return (
    <div className="home-page">
      <PlayerHeader text="Player Card" />
      <PlayerMain team={team} player={player} />
    </div>
  );
}

export default PlayerCard;
