class Account {
    constructor(username, password, team) {
        this.username = username;
        this.password = password;
        this.team = team;
    }

    isValid() {
        return this.username.length > 0 && this.password.length > 0;
    }
}

module.exports = { Account };
