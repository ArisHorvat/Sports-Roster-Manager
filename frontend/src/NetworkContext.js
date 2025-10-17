import React, { createContext, useState, useEffect, useContext } from "react";
import axios from "axios";
import { ServiceContext } from "./ServiceContext";

const NetworkContext = createContext({ isOnline: true, isServerUp: true });

export const NetworkProvider = ({ children }) => {
  const { playerService, teamService } = useContext(ServiceContext)
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [isServerUp, setIsServerUp] = useState(true);

  useEffect(() => {
    const updateOnlineStatus = () => setIsOnline(navigator.onLine);
    window.addEventListener("online", updateOnlineStatus);
    window.addEventListener("offline", updateOnlineStatus);
    return () => {
      window.removeEventListener("online", updateOnlineStatus);
      window.removeEventListener("offline", updateOnlineStatus);
    };
  }, []);

  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const apiUrl = process.env.REACT_APP_API_URL;
        await axios.get(`${apiUrl}/ping`);
        setIsServerUp(true);
      } catch {
        setIsServerUp(false);
      }
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (isOnline && isServerUp) {
      const syncPendingOperations = async () => {
        const pending = JSON.parse(localStorage.getItem("pendingUpdates") || "[]");
        const remaining = [];
        for (const op of pending) {
          try {
            if (op.type === "update") {
              await playerService.updatePlayer(op.playerData);
            } else if (op.type === "create") {
              const newPlayer = await playerService.addPlayer(op.playerData);
              await teamService.addPlayer(newPlayer.teamId, newPlayer.playerId);
            } else if (op.type === "delete") {
              const deletedPlayer = await playerService.removePlayer(op.playerId);
              console.log(deletedPlayer);
              await teamService.removePlayer(deletedPlayer.teamId, deletedPlayer.playerId);
            }
          } 
          catch (err) {
            console.error("Failed to sync op:", op, err);
            remaining.push(op);
          }
        }
        localStorage.setItem("pendingUpdates", JSON.stringify(remaining));
      };
  
      syncPendingOperations();
    }
  }, [isOnline, isServerUp]);
  

  return (
    <NetworkContext.Provider value={{ isOnline, isServerUp }}>
      {children}
    </NetworkContext.Provider>
  );
};

export const useNetworkStatus = () => useContext(NetworkContext);
