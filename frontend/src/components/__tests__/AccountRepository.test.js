import { AccountRepository } from '../../repository/AccountRepository';
import { Account } from '../../domain/Account';
import { Team } from '../../domain/Team';
import { mockData } from '../../MockData';

describe('AccountRepository', () => {
    beforeEach(() => {
        AccountRepository.accounts = []; // Reset mock data before each test
    });

    test('should save an account', () => {
        const team = new Team(100, 'Test Team');
        const account = new Account('testUser', 'password123', team);

        AccountRepository.save(account);

        expect(mockData.accounts).toContain(account);
    });

    test('should find an account by username', () => {
        const team = new Team(200, 'Test Team 2');
        const account = new Account('testUser2', 'password123', team);

        AccountRepository.save(account);

        const foundAccount = AccountRepository.findByUsername('testUser2');

        expect(foundAccount).toBe(account);
    });

    test('should return undefined if username is not found', () => {
        const foundAccount = AccountRepository.findByUsername('nonExistentUser');

        expect(foundAccount).toBeUndefined();
    });
});
