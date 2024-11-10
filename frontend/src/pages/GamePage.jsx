import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { CheckCircle2, XCircle, Trophy, Send } from 'lucide-react'

export default function GamePage() {
  const { gamePin } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { players, gameName, numberOfTeams, currentPlayerName, submitters} = location.state || {};
  
  const questions = [
    {
      question: "What is the capital of France?",
      answers: ['Paris', 'London', 'Berlin', 'Madrid'],
      correctAnswer: 'Paris'
    },
    {
      question: "Which planet is known as the Red Planet?",
      answers: ['Mars', 'Venus', 'Jupiter', 'Saturn'],
      correctAnswer: 'Mars'
    },
    {
      question: "What is the largest mammal in the world?",
      answers: ['Elephant', 'Blue Whale', 'Giraffe', 'Hippopotamus'],
      correctAnswer: 'Blue Whale'
    },
    {
      question: "Who painted the Mona Lisa?",
      answers: ['Vincent van Gogh', 'Pablo Picasso', 'Leonardo da Vinci', 'Michelangelo'],
      correctAnswer: 'Leonardo da Vinci'
    },
    {
      question: "What is the chemical symbol for gold?",
      answers: ['Au', 'Ag', 'Fe', 'Cu'],
      correctAnswer: 'Au'
    }
  ];

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [timeLeft, setTimeLeft] = useState(10)
  const [selectedAnswers, setSelectedAnswers] = useState({ A: null, B: null })
  const [submittedAnswers, setSubmittedAnswers] = useState({ A: null, B: null })
  const [showResult, setShowResult] = useState(false)
  const [isCorrect, setIsCorrect] = useState({ A: false, B: false })
  const [leaderboard, setLeaderboard] = useState(
    Array.from({ length: numberOfTeams }, (_, i) => ({
      team: `Team ${String.fromCharCode(65 + i)}`,
      score: 0
    }))
  )
  const [chatMessages, setChatMessages] = useState([])
  const [currentMessage, setCurrentMessage] = useState('')
  const [gameOver, setGameOver] = useState(false)
  const chatRef = useRef(null)

  const totalQuestions = questions.length
  const currentQuestion = questions[currentQuestionIndex]
  const colors = ['bg-red-500', 'bg-blue-500', 'bg-green-500', 'bg-yellow-500']

  const currentPlayerTeam = players.find(p => p.name === currentPlayerName)?.team;
  const isSubmitter = submitters[currentPlayerTeam] === currentPlayerName;

  useEffect(() => {
    if (timeLeft > 0 && !(submittedAnswers.A && submittedAnswers.B)) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
      return () => clearTimeout(timer)
    } else if (timeLeft === 0 || (submittedAnswers.A && submittedAnswers.B)) {
      setShowResult(true)
      if (currentQuestionIndex < totalQuestions - 1) {
        setTimeout(() => {
          setCurrentQuestionIndex(prevIndex => prevIndex + 1)
          setTimeLeft(10)
          setSelectedAnswers({ A: null, B: null })
          setSubmittedAnswers({ A: null, B: null })
          setShowResult(false)
          updateLeaderboard()
        }, 2000)
      } else {
        setGameOver(true)
        setTimeout(() => {
          navigate('/results', { 
            state: { 
              leaderboard,
              gameName,
              totalQuestions
            } 
          });
        }, 3000)
      }
    }
  }, [timeLeft, currentQuestionIndex, submittedAnswers, totalQuestions, navigate, leaderboard, gameName])

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight
    }
  }, [chatMessages])

  const handleAnswerSelect = (answer) => {
    if (isSubmitter && !submittedAnswers[currentPlayerTeam]) {
      setSelectedAnswers(prev => ({ ...prev, [currentPlayerTeam]: answer }))
    }
  }

  const handleAnswerSubmit = () => {
    if (isSubmitter && selectedAnswers[currentPlayerTeam] && !submittedAnswers[currentPlayerTeam]) {
      setSubmittedAnswers(prev => ({ ...prev, [currentPlayerTeam]: selectedAnswers[currentPlayerTeam] }))
      const correct = selectedAnswers[currentPlayerTeam] === currentQuestion.correctAnswer
      setIsCorrect(prev => ({ ...prev, [currentPlayerTeam]: correct }))
    }
  }

  const updateLeaderboard = () => {
    setLeaderboard(prevLeaderboard => 
      prevLeaderboard.map(team => ({
        ...team,
        score: team.score + (isCorrect[team.team.charAt(team.team.length - 1)] ? 100 : 0)
      })).sort((a, b) => b.score - a.score)
    )
  }

  const handleSendMessage = () => {
    if (currentMessage.trim()) {
      setChatMessages([...chatMessages, { sender: currentPlayerName, text: currentMessage }])
      setCurrentMessage('')
      // In a real app, you'd send this message to other players
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-teal-600 to-indigo-800 flex flex-col items-center justify-center p-4 space-y-4">
      <Card className="w-full max-w-6xl bg-slate-800/90 backdrop-blur-md border-none text-slate-100">
        <CardContent className="p-6">
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-3xl font-bold text-teal-300">Question {currentQuestionIndex + 1}/{totalQuestions}</h2>
              <div className="text-2xl font-semibold text-indigo-300">Time: {timeLeft}s</div>
            </div>
            <Progress value={(timeLeft / 10) * 100} className="h-3" />
            <AnimatePresence mode="wait">
              <motion.div
                key={currentQuestionIndex}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="text-center"
              >
                <h3 className="text-2xl font-semibold mb-6 text-slate-200">{currentQuestion.question}</h3>
                <div className="grid grid-cols-2 gap-4">
                  {currentQuestion.answers.map((answer, index) => (
                    <Button
                      key={answer}
                      onClick={() => handleAnswerSelect(answer)}
                      disabled={!isSubmitter || submittedAnswers[currentPlayerTeam]}
                      className={`h-24 text-xl font-bold transition-all duration-300 ${colors[index]} hover:opacity-90 ${
                        selectedAnswers[currentPlayerTeam] === answer ? 'ring-4 ring-white' : ''
                      }`}
                    >
                      {answer}
                    </Button>
                  ))}
                </div>
                {isSubmitter && !submittedAnswers[currentPlayerTeam] && (
                  <Button
                    onClick={handleAnswerSubmit}
                    disabled={!selectedAnswers[currentPlayerTeam]}
                    className="mt-4 bg-teal-500 hover:bg-teal-600 text-white"
                  >
                    Submit Answer
                  </Button>
                )}
                {!isSubmitter && (
                  <div className="mt-4 text-white">
                    Waiting for your team submitter to choose an answer...
                    {selectedAnswers[currentPlayerTeam] && (
                      <p>Selected answer: {selectedAnswers[currentPlayerTeam]}</p>
                    )}
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
            <AnimatePresence>
              {showResult && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="absolute inset-0 flex items-center justify-center bg-slate-900/80 backdrop-blur-sm"
                >
                  <div className="text-center">
                    {isCorrect[currentPlayerTeam] ? (
                      <CheckCircle2 className="w-24 h-24 text-teal-400 mx-auto mb-4" />
                    ) : (
                      <XCircle className="w-24 h-24 text-red-500 mx-auto mb-4" />
                    )}
                    <h3 className="text-3xl font-bold mb-2 text-slate-100">
                      {isCorrect[currentPlayerTeam] ? 'Correct!' : 'Wrong!'}
                    </h3>
                    <p className="text-xl text-slate-300">The correct answer is {currentQuestion.correctAnswer}</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </CardContent>
      </Card>
      <div className="w-full max-w-6xl grid grid-cols-2 gap-4">
        <Card className="bg-slate-800/90 backdrop-blur-md border-none text-slate-100">
          <CardHeader>
            <CardTitle className="text-xl flex items-center justify-center text-teal-300">
              Team Chat
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[200px] mb-4" ref={chatRef}>
              {chatMessages.map((message, index) => (
                <div key={index} className="mb-2">
                  <span className="font-bold text-indigo-300">{message.sender}: </span>
                  <span className="text-slate-200">{message.text}</span>
                </div>
              ))}
            </ScrollArea>
            <div className="flex">
              <Input
                type="text"
                placeholder="Type a message..."
                value={currentMessage}
                onChange={(e) => setCurrentMessage(e.target.value)}
                className="flex-grow mr-2 bg-slate-600 border-slate-500 text-slate-100 placeholder-slate-400 focus:border-teal-400 focus:ring-teal-400"
              />
              <Button onClick={handleSendMessage} className="bg-teal-500 hover:bg-teal-600 text-slate-900">
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-slate-800/90 backdrop-blur-md border-none text-slate-100">
          <CardHeader>
            <CardTitle className="text-xl flex items-center justify-center text-teal-300">
              <Trophy className="mr-2" /> Team Leaderboard
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[200px]">
              {leaderboard.map((team, index) => (
                <motion.div
                  key={team.team}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="py-2 border-b border-slate-600 last:border-b-0 flex justify-between items-center"
                >
                  <span className={`font-semibold ${index === 0 ? "text-teal-300" : "text-indigo-300"}`}>
                    {team.team}
                  </span>
                  <span className="font-bold text-slate-200">{team.score}</span>
                </motion.div>
              ))}
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}