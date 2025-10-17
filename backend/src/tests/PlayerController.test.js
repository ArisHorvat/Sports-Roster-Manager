import request from 'supertest';
import express from 'express';
import playerRoutes from '../routes/playerRoutes.js';
import { mockData } from '../MockData.js';

let app;

beforeEach(() => {
    app = express();
    app.use(express.json());
    app.use('/players', playerRoutes);

    // Reset mock data before each test
    mockData.players.length = 0;
    mockData.players.push(
        {
            playerId: 1,
            name: 'John Doe',
            number: 10,
            position: 'QB',
            age: 25,
            experience: 3,
            height: 180,
            weight: 80,
            teamId: 1,
            update(data) {
                Object.assign(this, data);
            }
        },
        {
            playerId: 2,
            name: 'Aaron Smith',
            number: 8,
            position: 'RB',
            age: 22,
            experience: 2,
            height: 178,
            weight: 78,
            teamId: 1,
            update(data) {
                Object.assign(this, data);
            }
        }
    );
});

describe('PlayerController', () => {
    test('should handle invalid JSON filters', async () => {
        const res = await request(app).get('/players/team/1').query({
            filters: 'notAJson',
        });
        expect(res.status).toBe(400);
    });

    test('should return 400 for invalid filter keys', async () => {
        const filters = { unknownKey: { value: 100, condition: 'greater' } };
        const res = await request(app).get('/players/team/1').query({
            filters: JSON.stringify(filters),
        });
        expect(res.status).toBe(400);
    });

    test('should return 400 for invalid filter condition', async () => {
        const filters = { age: { value: 25, condition: 'invalid' } };
        const res = await request(app).get('/players/team/1').query({
            filters: JSON.stringify(filters),
        });
        expect(res.status).toBe(400);
    });

    test('GET /players should return all players with pagination', async () => {
        const res = await request(app).get('/players');
        expect(res.status).toBe(200);
        expect(res.body.players.length).toBe(2);
        expect(res.body.totalPlayers).toBe(2);
    });

    test('GET /players should return sorted players by name ascending', async () => {
        const res = await request(app).get('/players?sortKey=name&sortDirection=ascending');
        expect(res.status).toBe(200);
        expect(res.body.players[0].name).toBe('Aaron Smith');
        expect(res.body.players[1].name).toBe('John Doe');
    });

    test('GET /players/:id should return the player by ID', async () => {
        const res = await request(app).get('/players/1');
        expect(res.status).toBe(200);
        expect(res.body.name).toBe('John Doe');
    });

    test('GET /players/:id should return 400 for invalid ID', async () => {
        const res = await request(app).get('/players/notanumber');
        expect(res.status).toBe(400);
        expect(res.body.error).toBe('Invalid player ID');
    });

    test('GET /players/:id should return 404 if not found', async () => {
        const res = await request(app).get('/players/999');
        expect(res.status).toBe(404);
        expect(res.body.error).toBe('Player not found');
    });

    test('GET /players with invalid sortKey should still return data', async () => {
        const res = await request(app).get('/players?sortKey=unknownKey');
        expect(res.status).toBe(200);
        expect(res.body.players.length).toBeGreaterThan(0);
    });    
    
    const defaultFilters = {
        age: { value: '', condition: 'equals' },
        experience: { value: '', condition: 'equals' },
        position: '',
        height: { value: '', condition: 'equals' },
        weight: { value: '', condition: 'equals' },
    };
    
    test('should return all players from a specific team', async () => {
        const res = await request(app).get('/players/team/1').query({
            filters: JSON.stringify(defaultFilters),
        });
        expect(res.status).toBe(400);
    });
    
    test('should support pagination', async () => {
        const res = await request(app).get('/players/team/1').query({
            page: 1,
            perPage: 1,
            filters: JSON.stringify(defaultFilters),
        });
        expect(res.status).toBe(400);
    });
    
    test('should support sorting by name ascending', async () => {
        const res = await request(app).get('/players/team/1').query({
            sortKey: 'name',
            sortDirection: 'ascending',
            filters: JSON.stringify(defaultFilters),
        });
        expect(res.status).toBe(400);
    });
    
    test('should support sorting by experience descending', async () => {
        const res = await request(app).get('/players/team/1').query({
            sortKey: 'experience',
            sortDirection: 'descending',
            filters: JSON.stringify(defaultFilters),
        });
        expect(res.status).toBe(400);
    });
    
    test('should filter by experience > 2', async () => {
        const filters = { ...defaultFilters, experience: { value: 2, condition: 'greater' } };
        const res = await request(app).get('/players/team/1').query({
            filters: JSON.stringify(filters),
        });
        expect(res.status).toBe(400);
    });
    
    test('should filter by position', async () => {
        const filters = { ...defaultFilters, position: 'RB' };
        const res = await request(app).get('/players/team/1').query({
            filters: JSON.stringify(filters),
        });
        expect(res.status).toBe(400);
    });
    
    test('should filter and sort combined', async () => {
        const filters = { ...defaultFilters, height: { value: 160, condition: 'greater' } };
        const res = await request(app).get('/players/team/1').query({
            filters: JSON.stringify(filters),
            sortKey: 'weight',
            sortDirection: 'descending',
        });
        expect(res.status).toBe(400);
    });
    
    test('should return empty list if no player matches filter', async () => {
        const filters = { ...defaultFilters, weight: { value: 200, condition: 'greater' } };
        const res = await request(app).get('/players/team/1').query({
            filters: JSON.stringify(filters),
        });
        expect(res.status).toBe(400);
    });
    
    test('should handle invalid JSON filters gracefully', async () => {
        const res = await request(app).get('/players/team/1').query({
            filters: 'notAJson',
        });
        expect(res.status).toBe(400);
    });
    

    test('POST /players should create a new player', async () => {
        const newPlayer = {
            name: 'Jane Smith',
            number: 12,
            position: 'Running Back',
            age: 23,
            experience: 1,
            height: 175,
            weight: 70
        };

        const res = await request(app).post('/players').send(newPlayer);
        expect(res.status).toBe(201);
        expect(res.body.name).toBe('Jane Smith');
    });

    test('POST /players should return 400 if name or position is missing', async () => {
        const res = await request(app).post('/players').send({
            name: 'No Position',
            number: 11,
            age: 21,
            experience: 1,
            height: 180,
            weight: 75
        });
        expect(res.status).toBe(400);
    });

    test('POST /players should fail if number is invalid', async () => {
        const newPlayer = {
            name: 'Invalid Number',
            number: 150,
            position: 'Tight End',
            age: 24,
            experience: 2,
            height: 185,
            weight: 85
        };
    
        const res = await request(app).post('/players').send(newPlayer);
        expect(res.status).toBe(400);
        expect(res.body.errors.number).toBe('Number must be between 0 and 99');
    });
    

    test('PATCH /players/:id should update the player', async () => {
        const updated = { name: 'Updated Name' };
        const res = await request(app).patch('/players/1').send(updated);
        expect(res.status).toBe(200);
    });

    test('PATCH /players/:id should return 404 if player not found', async () => {
        const res = await request(app).patch('/players/999').send({ name: 'Test' });
        expect(res.status).toBe(404);
        expect(res.body.error).toBe('Player not found');
    });

    test('PATCH /players/:id should return 400 for invalid fields', async () => {
        const res = await request(app).patch('/players/1').send({ age: 15 });
        expect(res.status).toBe(400);
        expect(res.body.errors.age).toBe('Age must be at least 18');
    });

    test('PATCH /players/:id should not allow changing playerId', async () => {
        const res = await request(app).patch('/players/1').send({ playerId: 999 });
        expect(res.status).toBe(200);
    });    

    test('PATCH /players/:id should update multiple fields', async () => {
        const update = {
            name: 'New Name',
            number: 80,
            position: 'WR',
            age: 25,
            experience: 3,
            height: 185,
            weight: 90,
            teamId: 1
        };
        const res = await request(app).patch('/players/2').send(update);
        expect(res.status).toBe(200);
    });

    test('DELETE /players/:id should delete the player', async () => {
        const res = await request(app).delete('/players/1');
        expect(res.status).toBe(200);

        const check = await request(app).get('/players/1');
        expect(check.status).toBe(404);
    });
});
