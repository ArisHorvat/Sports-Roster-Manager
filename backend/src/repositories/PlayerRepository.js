import { mockData } from '../MockData.js';

export class PlayerRepository {
    constructor() {
        this.players = mockData.players;
    }

    save(player) {
        this.players.push(player);
    }

    getAllPlayers() {
        return this.players;
    }

    getAllPlayersFromTeam(teamId) {
        if (!teamId) 
            throw new Error("Team ID is required");

        
        return this.players.filter(player => player.teamId === parseInt(teamId));
    }

    findById(playerId) {
        return this.players.find(player => player.playerId === playerId);
    }

    update(player) {
        if (!player || !player.playerId) {
            throw new Error("Invalid player data");
        }

        const oldPlayer = this.findById(player.playerId);
        if (!oldPlayer) {
            return false;
        }

        oldPlayer.update(player);
        return true;
    }

    add(player) {
        let emptyId = 1;
        while (this.findById(emptyId)) {
            emptyId += 1;
        }

        player.playerId = emptyId;
        this.save(player);
    }

    remove(playerId) {
        const deletedPlayer = this.players.find(p => p.playerId === playerId)
        this.players = this.players.filter(p => p.playerId !== playerId);

        return deletedPlayer;
    }
}
