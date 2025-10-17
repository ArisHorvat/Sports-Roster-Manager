class Player {
    constructor(playerId, name, number, position, age, experience, height, weight, teamId) {
        this.playerId = playerId;
        this.name = name;
        this.number = number;
        this.position = position;
        this.age = age;
        this.experience = experience;
        this.height = height;
        this.weight = weight;
        this.teamId = teamId;
    }
    
    update(newPlayer){
        this.playerId = newPlayer.playerId;
        this.name = newPlayer.name;
        this.number = newPlayer.number;
        this.position = newPlayer.position;
        this.age = newPlayer.age;
        this.experience = newPlayer.experience;
        this.height = newPlayer.height;
        this.weight = newPlayer.weight;
        this.teamId = newPlayer.teamId;
    }
}

module.exports = { Player };