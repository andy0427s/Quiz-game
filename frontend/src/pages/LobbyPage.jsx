import React, { useState, useEffect, useCallback } from 'react'
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Users, Play, CheckCircle, Send } from 'lucide-react'
import {useGameStore} from "@/store/store.js";
import TeamsPanel from "@/components/TeamsPanel.jsx";
import {ClockLoader} from "react-spinners";
import PlayersList from "@/components/PlayerList.jsx";
import {requestReadyGame} from "@/api/game.api.js";
import {toast} from "react-toastify";

export default function LobbyPage() {

  const { gameData, userId } = useGameStore();
  const navigate = useNavigate();

  const clickReady = async () => {
    if (!gameData) {
      return;
    }
    try {
      await requestReadyGame({
        gameId: gameData._id,
        userId
      });
    } catch (error) {

    }
  }

  useEffect(() => {
    if (gameData && gameData.state === 'started') {
      navigate(`/game/${gameData._id}`);
    }
  }, [gameData]);

  if (!gameData) {
    return null;
  }

  const player = gameData.players.find(p => p._id === userId);
  const isReady = player && player.isReady;



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
            <h2 className="text-2xl font-semibold text-indigo-300">{gameData.name}</h2>
            <div className="flex items-center space-x-2">
            <span className="text-lg text-indigo-300">PIN:</span>
              <div 
                className="text-4xl font-bold bg-indigo-600 text-white px-4 py-2 rounded-lg"
                aria-label="Game PIN"
              >
                {gameData.pin}
              </div>
            </div>
          </motion.div>
        </CardHeader>
        <CardContent>
          <div className={'flex justify-center'}>
            <ClockLoader color={'#fff'}/>
          </div>
          <p className={'text-center text-xl font-bold mt-2'}>
            Waiting for players to ready up...
          </p>
          <div className="space-y-6">
            <div>
              <div className="flex justify-between items-center mb-4">
                <span className="text-xl flex items-center text-teal-300">
                  <Users className="mr-2" />
                  Players ({gameData.players.length}/{gameData.numberOfPlayers})
                </span>
              </div>
              <PlayersList players={gameData.players} />
              <div className={'flex mt-4 justify-center'}>
                <button
                    onClick={clickReady}
                    disabled={isReady}
                    className="bg-teal-500 hover:bg-teal-600 text-slate-900 font-semibold px-4 py-2 rounded-lg">
                  {isReady ? 'You are ready' : 'Ready Up'}
                </button>
              </div>
            </div>
        
          </div>
        </CardContent>
      </Card>
    </div>
  )
}