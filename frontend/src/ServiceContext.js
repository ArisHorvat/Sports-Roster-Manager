import { createContext } from 'react';
import { PlayerService } from './services/PlayerService';
import { TeamService } from './services/TeamService';
import { AccountService } from './services/AccountService';

// Create services once
const services = {
  playerService: new PlayerService(),
  teamService: new TeamService(),
  accountService: new AccountService(),
};

export const ServiceContext = createContext(services);
export const ServiceProvider = ({ children }) => (
  <ServiceContext.Provider value={services}>
    {children}
  </ServiceContext.Provider>
);
