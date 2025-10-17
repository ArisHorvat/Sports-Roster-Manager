import axios from 'axios';

export class PlayerService {
    constructor() {
      this.baseUrl = process.env.REACT_APP_API_URL;
      console.log('API URL:', this.baseUrl); // Debug log
    }

    async getPlayerById(playerId) {
      const response = await axios.get(`${this.baseUrl}/players/${playerId}`, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      return response.data;
    }

    async getAllPlayers({ sortKey, sortDirection, page = 1, perPage = 10 }) {
      const response = await axios.get(`${this.baseUrl}/players`, {
        params: {
          sortKey,
          sortDirection,
          page,
          perPage,
        },
        headers: {
          'Content-Type': 'application/json'
        }
      });
      return response.data;
    }

    async getAllPlayersFromTeam(teamId, { sortKey, sortDirection, page = 1, perPage = 10, filters }) {
      const response = await axios.get(`${this.baseUrl}/players/team/${teamId}`, {
        params: {
          sortKey,
          sortDirection,
          page,
          perPage,
          filters: JSON.stringify(filters)
        },
        headers: {
          'Content-Type': 'application/json'
        }
      });

      return response.data;
    }

    async updatePlayer(playerData) {
      const token = localStorage.getItem('token');

      if (!token) {
          throw new Error('No token found');
      }
      
      const response = await axios.patch(`${this.baseUrl}/players/${playerData.playerId}`, playerData, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      return response.data;
    }

    async addPlayer(playerData) {
      const token = localStorage.getItem('token');

      if (!token) {
          throw new Error('No token found');
      }

      const response = await axios.post(`${this.baseUrl}/players`, playerData, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      return response.data;
    }

    async removePlayer(playerId) {
      const token = localStorage.getItem('token');

      if (!token) {
          throw new Error('No token found');
      }

      const response = await axios.delete(`${this.baseUrl}/players/${playerId}`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      
      console.log(response);
      return response.data;
    }
}
