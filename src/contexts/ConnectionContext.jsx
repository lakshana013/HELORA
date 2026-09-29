import { createContext, useContext, useState, useEffect } from 'react';
import connectionManager from '../utils/connectionManager.js';

const ConnectionContext = createContext({
  isOnline: true,
  status: 'online',
  devMode: null,
  setDevMode: () => {},
});

export function ConnectionProvider({ children }) {
  const [status, setStatus] = useState(connectionManager.getStatus());

  useEffect(() => {
    return connectionManager.subscribe((s) => setStatus(s));
  }, []);

  const isOnline = connectionManager.getIsOnline();

  const setDevMode = (mode) => {
    connectionManager.setDevMode(mode);
  };

  return (
    <ConnectionContext.Provider value={{ isOnline, status, devMode: connectionManager.getDevMode(), setDevMode }}>
      {children}
    </ConnectionContext.Provider>
  );
}

export function useConnection() {
  return useContext(ConnectionContext);
}

export default ConnectionContext;
