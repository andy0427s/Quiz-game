import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {requestCreateGame} from "@/api/game.api.js";
import {useGameStore} from "@/store/store.js";

export default function CreateGamePage() {
  const [gameTitle, setGameTitle] = useState('')
  const [questionTime, setQuestionTime] = useState(30)
  const [randomizeQuestions, setRandomizeQuestions] = useState(false)
  const [showLeaderboard, setShowLeaderboard] = useState(true)
  const [numberOfPlayers, setNumberOfPlayers] = useState(10)
  const [numberOfTeams, setNumberOfTeams] = useState(2)
  const [username, setUsername] = useState('')
  const [questionCount, setQuestionCount] = useState(10)
  const navigate = useNavigate();

  const { setShowLoading, setGameData, setUserId } = useGameStore();

  const handleCreateGame = async () => {

    try {
      setShowLoading(true);
      const result = await requestCreateGame({
        title: gameTitle,
        numberOfPlayers,
        numberOfTeams,
        timePerQuestion: questionTime,
        randomizeQuestions,
        showLeaderboard,
        username,
        questionCount,
      });
      const gameData = result.data.gameData;
      if (gameData) {
        setGameData(gameData);
        setUserId(result.data.userId);
        navigate(`/lobby/${gameData._id}`);
      }
    } catch (error) {
      console.log(error);
    } finally {
        setShowLoading(false);
    }

  }

  const handleBack = () => {
    navigate('/');
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-teal-600 to-indigo-800 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-slate-800/90 backdrop-blur-md border-none text-slate-100">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-center text-teal-300">Create Game</CardTitle>
        </CardHeader>
        <CardContent>
          <motion.div
              className="space-y-6"
              initial={{opacity: 0, y: 20}}
              animate={{opacity: 1, y: 0}}
              transition={{duration: 0.5}}
          >
            <div className="space-y-2">
              <Label htmlFor="gameTitle" className="text-slate-200">Game Title</Label>
              <Input
                  id="gameTitle"
                  placeholder="Enter game title"
                  value={gameTitle}
                  onChange={(e) => setGameTitle(e.target.value)}
                  className="bg-slate-700 border-slate-600 text-slate-100 placeholder-slate-400 focus:border-teal-400 focus:ring-teal-400"
              />
            </div>


            <div className="space-y-2">
              <Label htmlFor="gameTitle" className="text-slate-200">Your name</Label>
              <Input
                  id="username"
                  placeholder="Enter your name"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="bg-slate-700 border-slate-600 text-slate-100 placeholder-slate-400 focus:border-teal-400 focus:ring-teal-400"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="numberOfPlayers" className="text-slate-200">Number of Players</Label>
              <Select onValueChange={(value) => setNumberOfPlayers(Number(value))}>
                <SelectTrigger className="bg-slate-700 border-slate-600 text-slate-100">
                  <SelectValue placeholder="Select number of players"/>
                </SelectTrigger>
                <SelectContent>
                  {[4, 6, 8, 10, 12, 14, 16].map((num) => (
                      <SelectItem key={num} value={num.toString()}>{num} players</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="numberOfTeams" className="text-slate-200">Number of Teams</Label>
              <Select onValueChange={(value) => setNumberOfTeams(Number(value))}>
                <SelectTrigger className="bg-slate-700 border-slate-600 text-slate-100">
                  <SelectValue placeholder="Select number of teams"/>
                </SelectTrigger>
                <SelectContent>
                  {[2, 3, 4].map((num) => (
                      <SelectItem key={num} value={num.toString()}>{num} teams</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="questionTime" className="text-slate-200">Time per Question (seconds)</Label>
              <Slider
                  id="questionTime"
                  min={10}
                  max={60}
                  step={5}
                  value={[questionTime]}
                  onValueChange={(value) => setQuestionTime(value[0])}
                  className="bg-slate-700"
              />
              <div className="text-center text-teal-300">{questionTime} seconds</div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="questionTime" className="text-slate-200">Number Of Questions</Label>
              <Slider
                  id="questionCount"
                  min={5}
                  max={100}
                  step={1}
                  value={[questionCount]}
                  onValueChange={(value) => setQuestionCount(value[0])}
                  className="bg-slate-700"
              />
              <div className="text-center text-teal-300">Total: {questionCount}</div>
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="randomizeQuestions" className="text-slate-200">Randomize Questions</Label>
              <Switch
                  id="randomizeQuestions"
                  checked={randomizeQuestions}
                  onCheckedChange={setRandomizeQuestions}
                  className="bg-slate-700 data-[state=checked]:bg-teal-500"
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="showLeaderboard" className="text-slate-200">Show Leaderboard</Label>
              <Switch
                  id="showLeaderboard"
                  checked={showLeaderboard}
                  onCheckedChange={setShowLeaderboard}
                  className="bg-slate-700 data-[state=checked]:bg-teal-500"
              />
            </div>
            <Button
                className="w-full bg-teal-500 hover:bg-teal-600 text-slate-900 font-semibold transition-colors duration-200"
                onClick={handleCreateGame}
            >
              Create Game
            </Button>
            <Button
                className="w-full bg-slate-600 hover:bg-slate-700 text-slate-100 font-semibold transition-colors duration-200"
                onClick={handleBack}
            >
              Back
            </Button>
          </motion.div>
        </CardContent>
      </Card>
    </div>
  )
}