import './MyLeaguePage.css';
import { useState, useEffect, useContext } from 'react';
import { useLocation } from 'react-router-dom';
import MyLeagueHeader from '../../components/MyLeagueHeader/MyLeagueHeader';
import MyLeagueMain from '../../components/MyLeagueMain/MyLeagueMain';

import { ServiceContext } from '../../ServiceContext';
import { TeamAccountContext } from '../../TeamAccountContext';

function MyLeaguePage() {
  const { teamService } = useContext(ServiceContext);
  const { teamId } = useContext(TeamAccountContext);

  const [teams, setTeams] = useState([]);  // State to store the teams
  const [currentIndex, setCurrentIndex] = useState(0);  // State to track the current team index
  const [loading, setLoading] = useState(true);  // State for loading
  const [error, setError] = useState(null);  // State for errors

  // Fetch all teams on component mount
  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const teamsData = await teamService.getAllTeams(); // Fetch teams
        setTeams(teamsData);  // Set teams data

        // Find the team index based on accountTeamId
        const teamIndex = teamsData.findIndex(team => team.id == teamId);
                
        if (teamIndex !== -1) {
          setCurrentIndex(teamIndex);  // Set the initial index to the team with accountTeamId
        } else {
          console.error('Team not found');
        }

      } catch (error) {
        setError('Failed to load teams');  // Handle errors
      } finally {
        setLoading(false);  // Set loading to false
      }
    };

    fetchTeams(); // Call the fetch function
  }, [teamId]); // Run this effect once on component mount

  if (loading) {
    return <div>Loading...</div>;  // Show loading message while fetching teams
  }

  if (error) {
    return <div>{error}</div>;  // Show error message if fetching fails
  }

  const handlePrev = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + teams.length) % teams.length);
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % teams.length);
  };

  const currentTeam = teams[currentIndex]; // Get the current team based on index

  return (
    <div className="league-page">
      <MyLeagueHeader 
        team={currentTeam} 
        onPrev={handlePrev} 
        onNext={handleNext}
      />
      <MyLeagueMain team={currentTeam} />
    </div>
  );
}

export default MyLeaguePage;
