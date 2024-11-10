import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import QuizGamePortal from './pages/QuizGamePortal'
import CreateGamePage from './pages/CreateGamePage'
import LobbyPage from './pages/LobbyPage'
import PlayerLobbyPage from './pages/PlayerLobbyPage'
import GamePage from './pages/GamePage'
import ResultsPage from './pages/ResultsPage'  // Make sure this component exists

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<QuizGamePortal />} />
        <Route path="/create-game" element={<CreateGamePage />} />
        <Route path="/lobby/:gameId" element={<LobbyPage />} />
        <Route path="/player-lobby" element={<PlayerLobbyPage />} />
        <Route path="/game/:gamePin" element={<GamePage />} />
        <Route path="/results" element={<ResultsPage />} />
      </Routes>
    </Router>
  );
}

export default App