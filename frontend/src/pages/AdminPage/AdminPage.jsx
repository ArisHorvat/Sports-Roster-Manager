import React from 'react';
import MonitoredUsers from '../../components/MonitoredUsers/MonitoredUsers';
import MyButton from '../../components/MyButton/MyButton';
import { TeamAccountContext } from '../../TeamAccountContext';
import { useContext } from 'react';
import axios from 'axios';


const AdminDashboard = () => {
  const token = localStorage.getItem('token');
  const { teamId } = useContext(TeamAccountContext);

  const simulateAttack = async () => {
    if (!token) {
        alert('No token found. Please login.');
        return;
    }

    const teamId = 1; 
    for (let i = 0; i < 12; i++) {
        const data = {
            name: `BotPlayer${i}`,
            age: 20,
            weight: 210,
            height: 210,
            experience: 1,
            position: 'QB',
            teamId: teamId
        };

        try {
            const apiUrl = process.env.REACT_APP_API_URL;
            const response = await axios.post(`${apiUrl}/players`, data, {
                headers: {
                Authorization: `Bearer ${token}`
                }
            });
            console.log(`Created BotPlayer${i}:`, response.data);
        } 
        catch (err) {
            console.error(`Error creating BotPlayer${i}:`, err.response?.data || err.message);
        }
    }
  }

  return (
    <div>
      <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>Admin Dashboard</h1>
      <MonitoredUsers token={token} />
      <MyButton text="Simulate Attack" onClick={simulateAttack}></MyButton>
    </div>
  );
};

export default AdminDashboard;
