import { mockData } from '../MockData.js';

export class TeamRepository {
    constructor() {
        this.teams = mockData.teams;
    }

    findById(teamId) {
        return this.teams.find(team => team.teamId === teamId);
    }

    getAllTeams() {
        return this.teams;
    }

    addPlayer(teamId, player) {
        const team = this.findById(teamId);
        if (team && typeof team.addPlayer === 'function') {
            team.addPlayer(player);
        }
    }

    removePlayer(teamId, playerId) {
        const team = this.findById(teamId);
        if (team && typeof team.removePlayer === 'function') {
            team.removePlayer(playerId);
        }
    }
}
