import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';

import { ServiceProvider } from './ServiceContext';
import { TeamAccountProvider } from './TeamAccountContext';
import { NetworkProvider } from './NetworkContext';

import LoginPage from './pages/LoginPage/LoginPage'
import HomePage from './pages/HomePage/HomePage'
import MyLeaguePage from './pages/MyLeaguePage/MyLeaguePage'
import MyLabPage from './pages/MyLabPage/MyLabPage'
import PlayerCard from './pages/PlayerCard/PlayerCard';
import EditPlayerPage from './pages/EditPlayerPage/EditPlayerPage';
import AllPlayersPage from './pages/AllPlayersPage/AllPlayersPage';
import FilePage from './pages/FilePage/FilePage';
import AdminDashboard from './pages/AdminPage/AdminPage';

function App() {
  return (
    <Router basename="/app">
      <NetworkProvider>
        <TeamAccountProvider>
          <ServiceProvider>
            <div className="app">
              <Routes>
                <Route path="/health" element={<div>OK</div>} />
                <Route path="/" element={<LoginPage />} />
                <Route path="/home" element={<HomePage />} />
                <Route path="/files" element={<FilePage/>} />
                <Route path="/myleague" element={<MyLeaguePage />} />
                <Route path="/mylab/:teamId" element={<MyLabPage />} />
                <Route path="/allplayers" element={<AllPlayersPage />} />
                <Route path="/myleague/playercard/:teamId/:playerId" element={<PlayerCard />} />
                <Route path="/allPlayers/playercard/:teamId/:playerId" element={<PlayerCard />} />
                <Route path="/editPlayer/:teamId/:playerId" element={<EditPlayerPage />} />
                <Route path="/admin" element={<AdminDashboard />} />
              </Routes>
            </div>
          </ServiceProvider>
        </TeamAccountProvider>
      </NetworkProvider>
    </Router>
  );
}

export default App;
