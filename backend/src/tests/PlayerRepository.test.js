import { PlayerRepository } from '../repositories/PlayerRepository.js';
import { mockData } from '../MockData.js';
import { Player } from '../domain/Player.js';

describe('PlayerRepository', () => {
  let playerRepository;

  beforeEach(() => {
    playerRepository = new PlayerRepository();
    mockData.players.length = 0;
    mockData.players.push({
      playerId: 1,
      name: 'Test Player',
      number: 1,
      position: 'QB',
      age: 25,
      experience: 2,
      height: 180,
      weight: 80,
      update(data) {
        Object.assign(this, data);
      }
    });
  });

  test('update modifies the player if found', () => {
    const updatedPlayer = {
      playerId: 1,
      name: 'Updated Player',
      number: 1,
      position: 'QB',
      age: 30,
      experience: 2,
      height: 180,
      weight: 80
    };

    const result = playerRepository.update(updatedPlayer);
    expect(result).toBe(true);

    const player = playerRepository.findById(1);
    expect(player.name).toBe('Updated Player');
    expect(player.age).toBe(30);
  });

  test('update does nothing if player not found', () => {
    const result = playerRepository.update({
      playerId: 999,
      name: 'Ghost',
      number: 0,
      position: 'Unknown',
      age: 0,
      experience: 0,
      height: 0,
      weight: 0
    });

    expect(result).toBe(false);
  });

  test('update throws error if player is invalid', () => {
    expect(() => playerRepository.update(null)).toThrow('Invalid player data');
    expect(() => playerRepository.update({})).toThrow('Invalid player data');
  });
});
