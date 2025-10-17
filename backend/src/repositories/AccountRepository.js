import { mockData } from '../MockData.js';

export class AccountRepository {
    constructor() {
        this.accounts = mockData.accounts;
    }

    save(account) {
        this.accounts.push(account);
    }

    findByUsername(username) {
        return this.accounts.find(acc => acc.username === username);
    }
}
