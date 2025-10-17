import { PlayerRepository } from '../../repository/PlayerRepository';
import { Player } from '../../domain/Player';

describe('PlayerRepository', () => {
    beforeEach(() => {
        // Reset players before each test
        PlayerRepository.players = [];
    });

    test('should add a player', () => {
        const player = new Player(1000, 'Player One', 10, 'QB', 25, 5, 200, 210);
        PlayerRepository.save(player);

        expect(PlayerRepository.getAllPlayers()).toContain(player);
    });

    test('should find a player by ID', () => {
        const player = new Player(2000, 'Player Two', 12, 'WR', 24, 4, 190, 200);
        PlayerRepository.save(player);

        const foundPlayer = PlayerRepository.findById(2000);
        expect(foundPlayer).toBe(player);
    });

    test('should update an existing player', () => {
        const player = new Player(3000, 'Player Three', 15, 'RB', 22, 3, 185, 195);
        PlayerRepository.save(player);

        const updatedPlayer = new Player(3000, 'Updated Player', 18, 'WR', 23, 4, 190, 200);
        PlayerRepository.update(updatedPlayer);

        const foundPlayer = PlayerRepository.findById(3000);
        expect(foundPlayer?.name).toBe('Updated Player');
        expect(foundPlayer?.number).toBe(18);
    });

    test('should throw an error when updating an invalid player', () => {
        const errorPlayer = new Player(null);

        expect(() => PlayerRepository.update(null)).toThrow('Invalid player data');
        expect(() => PlayerRepository.update(errorPlayer)).toThrow('Invalid player data');
    });

    test('should assign an automatic ID when adding a new player', () => {
        const player1 = new Player(null, 'Auto ID Player', 20, 'LB', 26, 6, 210, 220);
        PlayerRepository.add(player1);

        expect(player1.playerId).toBe(126);

        const player2 = new Player(null, 'Second Auto ID Player', 30, 'DB', 27, 5, 215, 225);
        PlayerRepository.add(player2);

        expect(player2.playerId).toBe(127);
    });

    test('should remove a player', () => {
        const player = new Player(4000, 'Removable Player', 14, 'TE', 23, 4, 195, 205);
        PlayerRepository.save(player);

        PlayerRepository.remove(4000);

        expect(PlayerRepository.findById(4000)).toBeUndefined();
    });
});
