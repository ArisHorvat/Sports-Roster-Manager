import React, { useEffect, useState } from 'react';
import axios from 'axios';

const MonitoredUsersPage = ({ token }) => {
  const [monitoredUsers, setMonitoredUsers] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMonitoredUsers = async () => {
      try {
            const apiUrl = process.env.REACT_APP_API_URL;
            const response = await axios.get(`${apiUrl}/admin/monitored-users`, {
            headers: {
              Authorization: `Bearer ${token}`,
          },
        });
        setMonitoredUsers(response.data);
      } catch (err) {
        if (err.response?.status === 403) {
          setError('Access denied. Admins only.');
        } else {
          setError('Failed to fetch monitored users.');
        }
      }
    };

    fetchMonitoredUsers();
  }, [token]);

  if (error) {
    return <div style={{ color: 'red', padding: '1rem' }}>{error}</div>;
  }

  return (
    <div style={{
      padding: '1rem',
      maxWidth: '600px',
      margin: '2rem auto',
      backgroundColor: '#fff',
      borderRadius: '8px',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    }}>
      <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>
        Monitored Users
      </h2>

      {monitoredUsers.length === 0 ? (
        <p>No suspicious activity detected.</p>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {monitoredUsers.map((user) => (
            <li key={user.id} style={{
              padding: '0.75rem',
              borderBottom: '1px solid #eee'
            }}>
              <strong>{user.username}</strong><br />
              <span style={{ color: '#555' }}>Reason: {user.reason}</span><br />
              <span style={{ fontSize: '0.8rem', color: '#888' }}>
                Added on: {new Date(user.createdAt).toLocaleString()}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default MonitoredUsersPage;
