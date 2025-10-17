import './HomePage.css';
import { useState, useEffect, useContext } from 'react';
import HomeHeader from '../../components/HomeHeader/HomeHeader';
import HomeMain from '../../components/HomeMain/HomeMain';

import { ServiceContext } from '../../ServiceContext';
import { TeamAccountContext } from '../../TeamAccountContext';
import { useNetworkStatus } from '../../NetworkContext';


function HomePage() {
  const { teamService } = useContext(ServiceContext);
  const { teamId } = useContext(TeamAccountContext);
  const { isOnline, isServerUp } = useNetworkStatus();

  const [team, setTeam] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch function separated for reuse
  const fetchTeam = async () => {
    setLoading(true);
    setError(null);

    try {
      const teamData = await teamService.getTeamById(parseInt(teamId));
      setTeam(teamData);
    } 
    catch (error) {
      // If offline or server is down, don't show error
      if (!isOnline || !isServerUp) {
        return;
      }
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Only try fetching when both online and server is up
    if (isOnline && isServerUp) {
      fetchTeam();
    }
  }, [teamId, isOnline, isServerUp]); // Retry when status changes

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!isOnline) {
    return <div className="offline-warning">⚠️ You are offline. Team data will load when you're back online.</div>;
  }

  if (!isServerUp) {
    return <div className="offline-warning">⚠️ Server is down. Team data will load once it's available.</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="home-page">
      <HomeHeader />
      <HomeMain team={team} teamId={teamId} />
    </div>
  );
}

export default HomePage;
