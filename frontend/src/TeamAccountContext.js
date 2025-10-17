import { createContext, useState, useEffect } from 'react';

const TeamAccountContext = createContext({
  teamId: null,
  setTeamId: () => {},
});

export const TeamAccountProvider = ({ children }) => {
  const [teamId, setTeamId] = useState(() => {
    const saved = localStorage.getItem('teamId');
    return saved ? parseInt(saved, 10) : null;
  });

  useEffect(() => {
    if (teamId !== null) {
      localStorage.setItem('teamId', teamId);
    } else {
      localStorage.removeItem('teamId');
    }
  }, [teamId]);

  return (
    <TeamAccountContext.Provider value={{ teamId, setTeamId }}>
      {children}
    </TeamAccountContext.Provider>
  );
};

export { TeamAccountContext };
