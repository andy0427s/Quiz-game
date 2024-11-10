import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { LogIn, Plus, Users } from 'lucide-react'

export default function QuizGamePortal() {
  const [gamePin, setGamePin] = useState('')
  const [playerName, setPlayerName] = useState('')
  const navigate = useNavigate();

  const handleCreateGame = () => {
    console.log('Creating new game...');
    navigate('/create-game');
  }

  const handleJoinGame = () => {
    console.log(`Joining game with PIN: ${gamePin}, Player: ${playerName}`);
    navigate(`/player-lobby?pin=${gamePin}&name=${playerName}`);
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-teal-600 to-indigo-800 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-slate-800/90 backdrop-blur-md border-none text-slate-100">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-center text-teal-300">QuizMaster</CardTitle>
          <CardDescription className="text-center text-slate-300">Create or join a multiplayer quiz game!</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="join" className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-slate-700">
              <TabsTrigger 
                value="join" 
                className="data-[state=active]:bg-teal-500 data-[state=active]:text-slate-900 text-slate-300 hover:text-slate-100"
              >
                Join Game
              </TabsTrigger>
              <TabsTrigger 
                value="create" 
                className="data-[state=active]:bg-teal-500 data-[state=active]:text-slate-900 text-slate-300 hover:text-slate-100"
              >
                Create Game
              </TabsTrigger>
            </TabsList>
            <TabsContent value="join">
              <motion.div 
                className="space-y-4 mt-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Input
                  type="text"
                  placeholder="Enter Game PIN"
                  value={gamePin}
                  onChange={(e) => setGamePin(e.target.value)}
                  className="bg-slate-700 border-slate-600 text-slate-100 placeholder-slate-600 focus:border-teal-400 focus:ring-teal-400"
                />
                <Input
                  type="text"
                  placeholder="Your Name"
                  value={playerName}
                  onChange={(e) => setPlayerName(e.target.value)}
                  className="bg-slate-700 border-slate-600 text-slate-100 placeholder-slate-400 focus:border-teal-400 focus:ring-teal-400"
                />
                <Button 
                  className="w-full bg-teal-500 hover:bg-teal-600 text-slate-900 font-semibold" 
                  onClick={handleJoinGame}
                  disabled={!gamePin || !playerName}
                >
                  <LogIn className="mr-2 h-4 w-4" /> Join Game
                </Button>
              </motion.div>
            </TabsContent>
            <TabsContent value="create">
              <motion.div 
                className="space-y-4 mt-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Button className="w-full bg-indigo-500 hover:bg-indigo-600 text-slate-100 font-semibold" onClick={handleCreateGame}>
                  <Plus className="mr-2 h-4 w-4" /> Create New Game
                </Button>
              </motion.div>
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="text-center text-sm text-slate-400">
          <Users className="mr-2 h-4 w-4" /> Challenge your friends and have fun!
        </CardFooter>
      </Card>
    </div>
  )
}