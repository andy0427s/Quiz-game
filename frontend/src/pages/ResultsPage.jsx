import React from 'react'
import { motion } from 'framer-motion'
import { useLocation, useNavigate } from 'react-router-dom'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Trophy, Medal, Home } from 'lucide-react'
import {useGameStore} from "@/store/store.js";

export default function ResultsPage() {

  const { gameData } = useGameStore();
  const location = useLocation();
  const navigate = useNavigate();
  const { leaderboard, gameName, totalQuestions } = location.state || {};

  const getIcon = (position) => {
    switch (position) {
      case 1: return <Trophy className="h-8 w-8 text-yellow-400" />
      case 2: return <Medal className="h-8 w-8 text-gray-400" />
      case 3: return <Medal className="h-8 w-8 text-amber-600" />
      default: return null
    }
  }

  if (!gameData) {
    return null;
  }

  const teamsScore = gameData.teamsScore.sort((a, b) => b.score - a.score);

  return (
    <div className="min-h-screen bg-gradient-to-b from-teal-600 to-indigo-800 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl bg-slate-800/90 backdrop-blur-md border-none text-slate-100">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-center text-teal-300">Game Results</CardTitle>
          {gameName && <p className="text-xl text-center text-indigo-300 mt-2">{gameName}</p>}
          {totalQuestions && <p className="text-lg text-center text-slate-300 mt-1">Total Questions: {totalQuestions}</p>}
        </CardHeader>
        <CardContent className="space-y-6">
          {teamsScore.map((result, index) => (
            <motion.div
              key={result.team}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center justify-between bg-slate-700 p-4 rounded-lg"
            >
              <div className="flex items-center">
                {getIcon(index + 1)}
                <span className="ml-4 text-xl font-semibold">{result.team}</span>
              </div>
              <span className="text-2xl font-bold text-teal-300">{result.score}</span>
            </motion.div>
          ))}
          <div className="flex justify-center mt-8">
            <Button 
              className="bg-teal-500 hover:bg-teal-600 text-slate-900 font-semibold"
              onClick={() => navigate('/')}
            >
              <Home className="mr-2 h-4 w-4" />
              Back to Home
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}