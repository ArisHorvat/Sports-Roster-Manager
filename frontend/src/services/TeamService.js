import axios from 'axios';

export class TeamService {
    constructor() {
        this.baseUrl = process.env.REACT_APP_API_URL;
        console.log('API URL:', this.baseUrl); // Debug log
    }

    async getTeamById(teamId) {
        const response = await axios.get(`${this.baseUrl}/teams/${teamId}`, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        return response.data;
    }

    async getAllTeams() {
        const response = await axios.get(`${this.baseUrl}/teams`, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        return response.data;
    }

    async addPlayer(teamId, playerId) {
        const token = localStorage.getItem('token');
        if (!token) {
            throw new Error('No token found');
        }

        const response = await axios.post(`${this.baseUrl}/teams/${teamId}/players`, 
            { playerId },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            }
        );
        return response.data;
    }

    async removePlayer(teamId, playerId) {
        const token = localStorage.getItem('token');
        if (!token) {
            throw new Error('No token found');
        }

        await axios.delete(`${this.baseUrl}/teams/${teamId}/players/${playerId}`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });
    }
}
