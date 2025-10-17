import { TeamRepository } from '../../repository/TeamRepository';
import { Team } from '../../domain/Team'; 
import { Player } from '../../domain/Player';

describe('TeamRepositoryTest', () => {
    beforeEach(() => {
        // Reset teams before each test
        TeamRepository.teams = [];
    });

    test('should add a team', () => {
        const team = new Team(100, 'Test Team');
        TeamRepository.save(team);

        expect(TeamRepository.getAllTeams()).toContain(team);
    });

    test('should find a team by ID', () => {
        const team = new Team(200, 'Another Team');
        TeamRepository.save(team);

        const foundTeam = TeamRepository.findById(200);
        expect(foundTeam).toBe(team);
    });

    test('should add a player to a team', () => {
        const team = new Team(300, 'Team With Player');
        TeamRepository.save(team);

        const player = new Player(1000, 'Player One', 10, 'QB', 25, 5, 200, 210);
        TeamRepository.addPlayer(300, player);

        expect(team.players).toContain(player);
    });

    test('should remove a player from a team', () => {
        const team = new Team(400, 'Team Removing Player');
        const player = new Player(2000, 'Player Two', 12, 'WR', 24, 4, 190, 200);
        
        team.addPlayer(player);
        TeamRepository.save(team);
        
        TeamRepository.removePlayer(400, 2000);

        expect(team.players).not.toContain(player);
    });
});
