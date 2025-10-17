import { useNavigate } from 'react-router-dom';
import { useState, useEffect, useContext, useRef, useCallback } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import './AllPlayersMain.css';

import { ServiceContext } from '../../ServiceContext';
import { useNetworkStatus } from '../../NetworkContext';

function AllPlayersMain(props) {
    const { playerService } = useContext(ServiceContext);
    const { isOnline, isServerUp } = useNetworkStatus();
    const navigate = useNavigate();

    const [players, setPlayers] = useState([]);
    const [visibleCount, setVisibleCount] = useState(20); // Initial number shown
    const [visiblePlayers, setVisiblePlayers] = useState([]);
    const [sortConfig, setSortConfig] = useState({ key: '', direction: 'ascending' });

    const loaderRef = useRef(null);

    // // WebSocket setup to listen for player updates
    // useEffect(() => {
    //     const socket = new WebSocket('ws://localhost:3000'); 
    //     socket.onmessage = (event) => {
    //         const newPlayer = JSON.parse(event.data);
    //         setPlayers((prevPlayers) => [newPlayer, ...prevPlayers]); 
    //     };
    //     return () => socket.close();
    // }, []);

    const fetchPlayers = async () => {
        try {
            const response = await playerService.getAllPlayers({
                sortKey: sortConfig.key,
                sortDirection: sortConfig.direction,
            });
            setPlayers(response.players);
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
        setVisibleCount(20); // Reset visible count on new sort
    };

    useEffect(() => {
        fetchPlayers();
    }, [sortConfig]);

    useEffect(() => {
        if (players.length === 0) 
            return;
        
        const newVisible = [];
        
        for (let i = 0; i < visibleCount; i++) {
            newVisible.push(players[i % players.length]);
        }
        
        setVisiblePlayers(newVisible);
    }, [players, visibleCount]);

    // Infinite scroll using IntersectionObserver
    const loadMore = useCallback(() => {
        setVisibleCount((prev) => prev + 20);
    }, []);

    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
                loadMore();
            }
        });

        if (loaderRef.current) {
            observer.observe(loaderRef.current);
        }

        return () => {
            if (loaderRef.current) {
                observer.unobserve(loaderRef.current);
            }
        };
    }, [loadMore]);

    // Charts
    const [ageData, setAgeData] = useState([]);
    const [experienceData, setExperienceData] = useState([]);
    const [positionData, setPositionData] = useState([]);
    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

    const sortChartData = (data, key, isNumeric = false) => {
        return data.sort((a, b) => {
            if (isNumeric) {
                return a[key] - b[key]; 
            } else {
                return a[key].localeCompare(b[key]); 
            }
        });
    };
    
    const updateChartData = () => {
        const ageGroups = {};
        players.forEach(player => {
            const ageGroup = `${Math.floor(player.age / 5) * 5}-${Math.floor(player.age / 5) * 5 + 4}`;
            ageGroups[ageGroup] = (ageGroups[ageGroup] || 0) + 1;
        });
        
        const sortedAgeData = sortChartData(
            Object.entries(ageGroups).map(([age, count]) => ({ age, count })),
            'age' // Sort by age range
        );
        setAgeData(sortedAgeData);
    
        const experienceLevels = {};
        players.forEach(player => {
            experienceLevels[player.experience] = (experienceLevels[player.experience] || 0) + 1;
        });
    
        const sortedExperienceData = sortChartData(
            Object.entries(experienceLevels).map(([exp, count]) => ({ exp: Number(exp), count })),
            'experience',
            true // Numeric sort
        );
        setExperienceData(sortedExperienceData);
    
        const positionCounts = {};
        players.forEach(player => {
            positionCounts[player.position] = (positionCounts[player.position] || 0) + 1;
        });
    
        const sortedPositionData = sortChartData(
            Object.entries(positionCounts).map(([pos, count]) => ({ name: pos, value: count })),
            'name' 
        );
        setPositionData(sortedPositionData);
    };

    useEffect(() => {
        updateChartData();
    }, [players]);

    const goToPlayerCard = (player) => {
        navigate(`/allplayers/playercard/${player.teamId}/${player.id}`);
    };

    return (
        <div className="allplayers-main-container" style={props.style}>
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
                        {visiblePlayers.map((player) => (
                            <tr key={player.id} onClick={() => goToPlayerCard(player)} style={{ cursor: 'pointer' }}>
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

                {/* Loader for infinite scroll */}
                <div ref={loaderRef} style={{ height: '20px' }} />
            </div>

            <div className="charts-container">
                <BarChart width={400} height={300} data={ageData}>
                    <XAxis dataKey="age" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="count" fill="#8884d8" />
                </BarChart>

                <LineChart width={400} height={300} data={experienceData}>
                    <XAxis dataKey="exp" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="count" stroke="#82ca9d" />
                </LineChart>

                <PieChart width={400} height={300}>
                    <Pie data={positionData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100}>
                        {positionData.map((_, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Pie>
                    <Tooltip />
                </PieChart>
            </div>
        </div>
    );
}

export default AllPlayersMain;
