import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {Navigate, useNavigate} from 'react-router-dom';
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import {useGameStore} from "@/store/store.js";
import ChatRoom from "@/components/ChatRoom.jsx";
import moment from "moment";
import { Users, Play, CheckCircle, Send, CircleCheckBig, CircleX } from 'lucide-react'
import {requestAnswer} from "@/api/game.api.js";
const colors = ['bg-red-500', 'bg-blue-500', 'bg-pink-500', 'bg-yellow-500']
export default function GamePage() {
  const { gameData, userId, setShowLoading } = useGameStore();
  const navigate = useNavigate();
  const [timeLeft, setTimeLeft] = useState(null);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isCorrect, setIsCorrect] = useState(null);

  const submitAnswer = async () => {
    try {
      setShowLoading(true);
      await requestAnswer({
        userId,
        gameId: gameData._id,
        questionIndex: gameData.currentQuestionIndex,
        answer: selectedAnswer
      });
    } catch (error) {
      console.log(error);
    } finally {
      setShowLoading(false);
    }
  }

  useEffect(() => {
    let timer = null;
    if (gameData) {
      let timeLeft = moment(gameData.currentQuestionStartTime).add(gameData.timePerQuestion, 'seconds').diff(moment(), 'seconds');
      setTimeLeft(timeLeft);
      timer = setInterval(() => {
        setTimeLeft(prevTimeLeft => {
          if (prevTimeLeft === 0) {
            clearInterval(timer);
          } else {
            return prevTimeLeft - 1;
          }
        })
      }, 1000);
    }
    return () => {
      clearInterval(timer);
    }
  }, [gameData]);


  useEffect(() => {
    if (!gameData) {
      return;
    }
    if (gameData.state === 'waiting') {
      navigate(`/lobby/${gameData._id}`);
      return;
    }

    if (gameData.state === 'ended') {
      navigate(`/results/${gameData._id}`);
      return;
    }

    const myTeam = gameData.teams.find(team => {
      return team.members.map(member => member._id).includes(userId);
    });
    const myTeamMembersIds = myTeam.members.map(member => member._id);
    const myTeamSubmitterAnswer = gameData.currentQuestionAnswers.find(answer => {
      return myTeamMembersIds.includes(answer.userId);
    });
    if (myTeamSubmitterAnswer) {
      setSelectedAnswer(myTeamSubmitterAnswer.answer);
      setIsCorrect(myTeamSubmitterAnswer.isCorrect);
    }  
  }, [gameData]);

  if (!gameData) {
    return null;
  }

  const totalQuestions = gameData.questionCount;
  const currentQuestion = gameData.currentQuestion;
  const isSubmitter = gameData.currentAnswerPlayers.includes(userId);
  const isAnswered = gameData.currentQuestionAnswers.map(item => item.userId).includes(userId);

  if (gameData.state === 'ended') {
    return <Navigate to={'/results/' + gameData._id} />
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-teal-600 to-indigo-800 flex flex-col items-center justify-center p-4 space-y-4">
      <Card className="w-full max-w-6xl bg-slate-800/90 backdrop-blur-md border-none text-slate-100">
        <CardContent className="p-6">
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-3xl font-bold text-teal-300">Question {gameData.currentQuestionIndex + 1}/{totalQuestions}</h2>
              <div className="text-2xl font-semibold text-indigo-300">Time: {timeLeft}s</div>
            </div>
            <Progress value={timeLeft / gameData.timePerQuestion * 100} className="h-3" />
            <AnimatePresence mode="wait">
              <motion.div
                key={gameData.currentQuestionIndex}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.1 }}
                className="text-center"
              >
                <h3 className="text-2xl font-semibold mb-6 text-slate-200">{currentQuestion.text}</h3>
                <div className="grid grid-cols-2 gap-4">
                  {currentQuestion.options.map((answer, index) => {
                    return (
                        <Button
                            key={answer}
                            
                            onClick={() => {
                              setSelectedAnswer(answer);
                            }}
                            disabled={!isSubmitter || isAnswered}
                            className={`h-24 text-xl font-bold transition-all duration-300 ${colors[index]} 
                              ${selectedAnswer === answer ? 'border-8 border-green-300' : ''}
                              hover:opacity-90`}>
                          {answer}
                        </Button>
                    )
                  })}
                </div>
                {isSubmitter && !isAnswered && (
                  <Button
                    onClick={submitAnswer}
                    disabled={!isSubmitter || !selectedAnswer || isAnswered}
                    className="mt-4 bg-teal-500 hover:bg-teal-600 text-white"
                  >
                    Submit Answer
                  </Button>
                )}

                {isAnswered && (
                  <div className="flex justify-center mt-4">
                    {isCorrect === false && (
                      <CircleX className="w-24 h-24 text-red-500 mx-auto" />
                    )}

                    {isCorrect === true && (
                      <CircleCheckBig className="w-24 h-24 text-teal-400 mx-auto" />
                    )}
                  </div>
                )}

                {!isSubmitter && (
                  <div className="mt-4 text-white">
                    Waiting for your team submitter to choose an answer...
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
            <div>
            {gameData.state === 'started' && (
              <div className="text-center text-yellow-400">
                <Send className="inline-block mr-2 h-5 w-5" />
                Answer Submitters:
                <p>
                  {gameData.currentAnswerPlayers.map((playerId, index) => {
                    const team = gameData.teams[index];
                    const player = team.members.find(member => member._id === playerId);
                    return `${player.username} (${team.name})`;
                  }).join("   -   ")}
                </p>
              </div>
            )}
            </div>
            <ChatRoom />
          </div>
        </CardContent>
      </Card>

    </div>
  )
}