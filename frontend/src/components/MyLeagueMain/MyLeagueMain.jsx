import { useNavigate } from 'react-router-dom';
import { useState, useEffect, useContext } from 'react';
import { FaChevronCircleLeft, FaChevronCircleRight } from "react-icons/fa";
import MySelect from '../MySelect/MySelect';
import MyFilter from '../MyFilter/MyFilter';
import './MyLeagueMain.css';

import { ServiceContext } from '../../ServiceContext';
import { useNetworkStatus } from '../../NetworkContext';

function MyLeagueMain(props) {
  const { playerService } = useContext(ServiceContext);
  const { isOnline, isServerUp } = useNetworkStatus();
  const navigate = useNavigate();
  const team = props.team;

  const options = [
    { value: 'QB', label: 'QB' },
    { value: 'RB', label: 'RB' },
    { value: 'WR', label: 'WR' },
    { value: 'TE', label: 'TE' },
    { value: 'OL', label: 'OL' },
    { value: 'DL', label: 'DL' },
    { value: 'LB', label: 'LB' },
    { value: 'DB', label: 'DB' },
    { value: 'ST', label: 'ST' },
  ];

  const [currentPage, setCurrentPage] = useState(1);

  const [filters, setFilters] = useState({
    age: { value: '', condition: 'equals' },
    experience: { value: '', condition: 'equals' },
    position: '',
    height: { value: '', condition: 'equals' },
    weight: { value: '', condition: 'equals' },
  });

  const [players, setPlayers] = useState([]);
  const [totalPlayers, setTotalPlayers] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [sortConfig, setSortConfig] = useState({ key: '', direction: 'ascending' });

  const goToPlayerCard = (teamId, player) => {
    navigate(`/myleague/playercard/${teamId}/${player.id}`);
  };

  const goToNextPage = () => {
    if (totalPages > currentPage) {
      setCurrentPage(prevPage => prevPage + 1);
    }
  };

  const goToPrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(prevPage => prevPage - 1);
    }
  };

  const fetchPlayers = async () => {
    const shouldUseOffline = !isOnline || !isServerUp;

    try {
      if (shouldUseOffline) {
        const cached = localStorage.getItem(`players_${team.id}_${currentPage}`);
        if (cached) {
          const { players, totalPlayers, totalPages } = JSON.parse(cached);
          setPlayers(players);
          setTotalPlayers(totalPlayers);
          setTotalPages(totalPages);
          return;
        } 
        else {
          console.warn("Offline, but no cached data available.");
          setPlayers([]);
          setTotalPlayers(0);
          setTotalPages(1);
          return;
        }
      }

      const response = await playerService.getAllPlayersFromTeam(
        team.id, 
        {
        sortKey: sortConfig.key,
        sortDirection: sortConfig.direction,
        page: currentPage,
        perPage: 10,
        filters: filters,
      });

      // Save to local cache
      localStorage.setItem(
        `players_${team.id}_${currentPage}`,
        JSON.stringify(response)
      );

      setPlayers(response.players);
      setTotalPlayers(response.totalPlayers);
      setTotalPages(response.totalPages);
    } catch (error) {
      console.error("Error fetching players", error);
    }
  };

  const handleSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  useEffect(() => {
    setCurrentPage(1); // Reset to first page when team changes
  }, [team]);

  useEffect(() => {
    fetchPlayers();
  }, [filters, sortConfig, currentPage, team]);

  return (
    <div className="league-main-container" style={props.style}>
      <div className="players-view">
        {!isOnline && <div className="offline-warning">⚠️ You are offline</div>}
        {isOnline && !isServerUp && <div className="offline-warning">⚠️ Server is unavailable</div>}
        <table className="players-table">
          <thead>
            <tr>
              <th onClick={() => handleSort('name')} style={{ cursor: 'pointer' }}>Player</th>
              <th onClick={() => handleSort('number')} style={{ cursor: 'pointer' }}>#</th>
              <th onClick={() => handleSort('position')} style={{ cursor: 'pointer' }}>Pos.</th>
              <th onClick={() => handleSort('age')} style={{ cursor: 'pointer' }}>Age</th>
              <th onClick={() => handleSort('experience')} style={{ cursor: 'pointer' }}>Exp.</th>
              <th onClick={() => handleSort('height')} style={{ cursor: 'pointer' }}>Height</th>
              <th onClick={() => handleSort('weight')} style={{ cursor: 'pointer' }}>Weight</th>
            </tr>
          </thead>
          <tbody>
            {players.map((player) => (
              <tr
                key={player.id}
                onClick={() => goToPlayerCard(team.id, player)}
                style={{ cursor: 'pointer' }}
              >
                <td>{player.name}</td>
                <td>{player.number}</td>
                <td>{player.position}</td>
                <td>{player.age}</td>
                <td>{player.experience}</td>
                <td>{player.height}</td>
                <td>{player.weight}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="players-navigation">
          <FaChevronCircleLeft
            onClick={goToPrevPage}
            style={{
              stroke: '#fff',
              strokeWidth: '1vw',
              fill: '#000',
              fontSize: '2.2vw',
              cursor: 'pointer',
            }}
          />
          <h1>Page {currentPage}</h1>
          <FaChevronCircleRight
            onClick={goToNextPage}
            style={{
              stroke: '#fff',
              strokeWidth: '1vw',
              fill: '#000',
              fontSize: '2.2vw',
              cursor: 'pointer',
            }}
          />
        </div>
      </div>

      <div className="players-filter">
        <div className="row-filter">
          <MyFilter
            filter="Age"
            value={filters.age.value}
            condition={filters.age.condition}
            onChange={(value, condition) =>
              setFilters({ ...filters, age: { value, condition } })
            }
          />
          <MyFilter
            filter="Experience"
            value={filters.experience.value}
            condition={filters.experience.condition}
            onChange={(value, condition) =>
              setFilters({ ...filters, experience: { value, condition } })
            }
          />
        </div>

        <div className="row-filter">
          <MySelect
            text="Position"
            options={options}
            onChange={(selectedOption) =>
              setFilters({ ...filters, position: selectedOption ? selectedOption.value : '' })
            }
          />
        </div>

        <div className="row-filter">
          <MyFilter
            filter="Height"
            value={filters.height.value}
            condition={filters.height.condition}
            onChange={(value, condition) =>
              setFilters({ ...filters, height: { value, condition } })
            }
          />
          <MyFilter
            filter="Weight"
            value={filters.weight.value}
            condition={filters.weight.condition}
            onChange={(value, condition) =>
              setFilters({ ...filters, weight: { value, condition } })
            }
          />
        </div>
      </div>
    </div>
  );
}

export default MyLeagueMain;
