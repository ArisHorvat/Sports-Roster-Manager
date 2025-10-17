export class Team {
    constructor(teamId, teamName) {
        this.teamId = teamId;
        this.teamName = teamName;
        
        let words = teamName.trim().split(" ");
        this.image = words[words.length - 1].toLowerCase() + ".png";
        
        this.nickname = words[words.length - 1];
        this.players = [];
    }

    getPlayerById(playerId) {
        return this.players.find(player => player.playerId === playerId);
    }

    addPlayer(player) {
        this.players.push(player);
    }

    removePlayer(playerId){
        this.players = this.players.filter(player => player.playerId !== playerId); 
    }
}
