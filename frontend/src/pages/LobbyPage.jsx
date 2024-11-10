import React, { useState, useEffect, useCallback } from 'react'
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Users, Play, CheckCircle, Send } from 'lucide-react'

export default function LobbyPage() {
  const { gameId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { gameTitle, numberOfPlayers = 10, numberOfTeams = 2 } = location.state || {};

  const [players, setPlayers] = useState([])
  const [gamePin, setGamePin] = useState('')
  const [gameName, setGameName] = useState(gameTitle || 'My Awesome Quiz')
  const [currentPlayerName, setCurrentPlayerName] = useState('');
  const [isTeamAllocationDone, setIsTeamAllocationDone] = useState(false)
  const [submitters, setSubmitters] = useState({ A: null, B: null })

  const assignSubmitters = useCallback(() => {
    if (isTeamAllocationDone) {
      const teamA = players.filter(player => player.team === 'A')
      const teamB = players.filter(player => player.team === 'B')

      if (teamA.length > 0 && teamB.length > 0) {
        setSubmitters({
          A: teamA[Math.floor(Math.random() * teamA.length)].name,
          B: teamB[Math.floor(Math.random() * teamB.length)].name
        })
      }
    }
  }, [isTeamAllocationDone, players])

  useEffect(() => {
    let playerCount = 0;
    const interval = setInterval(() => {
      if (playerCount < numberOfPlayers) {
        setPlayers(prevPlayers => {
          const newPlayer = {
            name: `Player ${prevPlayers.length + 1}`,
            ready: true,
            team: String.fromCharCode(65 + (prevPlayers.length % numberOfTeams)),
            isCurrentPlayer: prevPlayers.length === 0
          };
          if (newPlayer.isCurrentPlayer) {
            setCurrentPlayerName(newPlayer.name);
          }
          playerCount++;
          return [...prevPlayers, newPlayer];
        });
      } else {
        clearInterval(interval);
        setIsTeamAllocationDone(true);
      }
    }, 2000)

    // Simulating game pin generation
    setGamePin(gameId || Math.floor(100000 + Math.random() * 900000).toString())

    return () => clearInterval(interval)
  }, [numberOfPlayers, numberOfTeams, gameId])

  useEffect(() => {
    if (isTeamAllocationDone) {
      assignSubmitters()
    }
  }, [isTeamAllocationDone, assignSubmitters])

  const startGame = () => {
    console.log('Starting the game...')
    navigate(`/game/${gamePin}`, { 
      state: { 
        players, 
        gameName,
        numberOfTeams,
        currentPlayerName,
        submitters
      } 
    });
  }

  const renderTeam = (teamName) => {
    const teamPlayers = players.filter(player => player.team === teamName)
    const sortedPlayers = [
      ...teamPlayers.filter(player => player.name === submitters[teamName]),
      ...teamPlayers.filter(player => player.name !== submitters[teamName])
    ]
    return (
      <div className="mb-4" key={teamName}>
        <h3 className={`text-lg font-semibold mb-2 text-center text-${teamName === 'A' ? 'teal' : 'indigo'}-300`}>
          Team {teamName}
        </h3>
        <Card className={`bg-slate-700 border-none border-l-4 border-l-${teamName === 'A' ? 'teal' : 'indigo'}-500`}>
          <CardContent className="p-2">
            <ScrollArea className="h-[120px] pr-4">
              <AnimatePresence>
                {sortedPlayers.map((player) => (
                  <motion.div 
                    key={player.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.3 }}
                    className="py-2 border-b border-slate-600 last:border-b-0 flex justify-between items-center"
                  >
                    <span className="text-slate-200 flex items-center">
                      {player.name}
                      {player.name === currentPlayerName && <span className="ml-2 text-slate-200">(You)</span>}
                      {player.name === submitters[teamName] && (
                        <Send className="ml-2 h-4 w-4 text-yellow-400" title="Answer Submitter" />
                      )}
                    </span>
                    <CheckCircle className="text-teal-400" />
                  </motion.div>
                ))}
              </AnimatePresence>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    )
  }

  const renderTeams = () => {
    const teamNames = Array.from({ length: numberOfTeams }, (_, i) => String.fromCharCode(65 + i));
    return teamNames.map(teamName => renderTeam(teamName));
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-teal-600 to-indigo-800 flex items-center justify-center p-4">
      <Card className="w-full max-w-4xl bg-slate-800/90 backdrop-blur-md border-none text-slate-100">
      <CardHeader className="space-y-6">
        <CardTitle className="text-3xl font-bold text-center text-teal-300">Game Lobby</CardTitle>
          <motion.div 
            className="flex flex-col items-center space-y-4"
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-2xl font-semibold text-indigo-300">{gameName}</h2>
            <div className="flex items-center space-x-2">
            <span className="text-lg text-indigo-300">PIN:</span>
              <div 
                className="text-4xl font-bold bg-indigo-600 text-white px-4 py-2 rounded-lg"
                aria-label="Game PIN"
              >
                {gamePin}
              </div>
            </div>
          </motion.div>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div>
              <div className="flex justify-between items-center mb-4">
                <span className="text-xl flex items-center text-teal-300">
                  <Users className="mr-2" />
                  Players ({players.length}/{numberOfPlayers})
                </span>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {renderTeams()}
              </div>
            </div>
            {submitters.A && submitters.B && (
              <div className="text-center text-yellow-400">
                <Send className="inline-block mr-2 h-5 w-5" />
                Answer Submitters: {submitters.A} (Team A) and {submitters.B} (Team B)
              </div>
            )}
            <div className="space-y-6">
              <Button 
                className="w-full bg-teal-500 hover:bg-teal-600 text-slate-900 font-semibold" 
                onClick={startGame}
                disabled={players.length === 0} // Only disabled if there are no players
              >
                <Play className="mr-2 h-4 w-4" /> Start Game
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}