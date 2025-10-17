import request from 'supertest';
import express from 'express';
import teamRoutes from '../routes/teamRoutes.js';
import { mockData } from '../MockData.js';

let app;

beforeEach(() => {
    app = express();
    app.use(express.json());
    app.use('/teams', teamRoutes);

    // Reset mock data
    mockData.teams.length = 0;
    mockData.players.length = 0;

    mockData.players.push({
        playerId: 1,
        name: 'John Doe',
        number: 10,
        position: 'QB',
        age: 25,
        experience: 3,
        height: 180,
        weight: 80,
        update(data) {
            Object.assign(this, data);
        }
    });

    mockData.teams.push({
        teamId: 1,
        name: 'Alpha Team',
        players: [],
        addPlayer(player) {
            this.players.push(player);
        },
        removePlayer(playerId) {
            this.players = this.players.filter(p => p.playerId !== playerId);
        }
    });
});

describe('TeamController', () => {
    test('GET /teams returns all teams', async () => {
        const res = await request(app).get('/teams');
        expect(res.status).toBe(200);
        expect(res.body.length).toBe(1);
        expect(res.body[0].name).toBe('Alpha Team');
    });

    test('GET /teams/:id returns specific team', async () => {
        const res = await request(app).get('/teams/1');
        expect(res.status).toBe(200);
        expect(res.body.name).toBe('Alpha Team');
    });

    test('GET /teams/:id filters players by position', async () => {
        // Add the player to the team
        mockData.teams[0].players.push(mockData.players[0]);
    
        const res = await request(app).get('/teams/1').query({ position: 'QB' });
        expect(res.status).toBe(200);
        expect(res.body.players.length).toBe(1);
        expect(res.body.players[0].position).toBe('QB');
    });
    
    test('GET /teams/:id filters players by numeric field (greater)', async () => {
        mockData.teams[0].players.push(mockData.players[0]);
    
        const res = await request(app)
            .get('/teams/1')
            .query({ 'age[value]': '20', 'age[condition]': 'greater' });
    
        expect(res.status).toBe(200);
        expect(res.body.players.length).toBe(1);
        expect(res.body.players[0].age).toBeGreaterThan(20);
    });
    
    test('GET /teams/:id filters players by numeric field (less)', async () => {
        mockData.teams[0].players.push(mockData.players[0]);
    
        const res = await request(app)
            .get('/teams/1')
            .query({ 'weight[value]': '100', 'weight[condition]': 'less' });
    
        expect(res.status).toBe(200);
        expect(res.body.players.length).toBe(1);
        expect(res.body.players[0].weight).toBeLessThan(100);
    });
    
    test('GET /teams/:id returns empty list if no player matches filter', async () => {
        mockData.teams[0].players.push(mockData.players[0]);
    
        const res = await request(app)
            .get('/teams/1')
            .query({ 'experience[value]': '10', 'experience[condition]': 'greater' });
    
        expect(res.status).toBe(200);
        expect(res.body.players).toEqual([]);
    });
    
    test('GET /teams/:id applies pagination correctly', async () => {
        for (let i = 1; i <= 15; i++) {
            mockData.players.push({
                playerId: i,
                name: `Player ${i}`,
                number: i,
                position: 'WR',
                age: 20 + i,
                experience: i,
                height: 170 + i,
                weight: 70 + i,
                update(data) {
                    Object.assign(this, data);
                }
            });
            mockData.teams[0].players.push(mockData.players[i - 1]);
        }
    
        const res = await request(app).get('/teams/1').query({ page: 2, perPage: 5 });
    
        expect(res.status).toBe(200);
        expect(res.body.players.length).toBe(5);
        expect(res.body.currentPage).toBe('2');
        expect(res.body.totalPlayers).toBe(15);
        expect(res.body.totalPages).toBe(3);
    });
    
    test('GET /teams/:id applies sorting by name (ascending)', async () => {
        mockData.teams[0].players.push({
            playerId: 99,
            name: 'Aaron',
            number: 12,
            position: 'RB',
            age: 26,
            experience: 4,
            height: 175,
            weight: 82,
            update(data) {
                Object.assign(this, data);
            }
        });
    
        mockData.teams[0].players.push(mockData.players[0]); // John Doe
    
        const res = await request(app)
            .get('/teams/1')
            .query({ sortKey: 'name', sortDirection: 'ascending' });
    
        expect(res.status).toBe(200);
        expect(res.body.players[0].name).toBe('Aaron');
    });
    

    test('POST /teams/:id/players adds player to team', async () => {
        const res = await request(app)
            .post('/teams/1/players')
            .send({ playerId: 1 });

        expect(res.status).toBe(200);

        const team = mockData.teams.find(t => t.teamId === 1);
        expect(team.players.length).toBe(1);
        expect(team.players[0].name).toBe('John Doe');
    });

    test('POST /teams/:id/players returns 404 if player not found', async () => {
        const res = await request(app).post('/teams/1/players').send({ playerId: 999 });
        expect(res.status).toBe(404);
        expect(res.body.error).toBe('Player not found');
    });

    test('POST /teams/:id/players returns 404 if team not found', async () => {
        const res = await request(app).post('/teams/999/players').send({ playerId: 1 });
        expect(res.status).toBe(404);
        expect(res.body.error).toBe('Team not found');
    });

    test('DELETE /teams/:id/players/:playerId removes player from team', async () => {
        const team = mockData.teams[0];
        team.players.push(mockData.players[0]); // Add the player manually

        const res = await request(app).delete('/teams/1/players/1');
        expect(res.status).toBe(204);

        expect(team.players.length).toBe(0);
    });
});
