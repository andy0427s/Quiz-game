import React, {useEffect} from 'react'
import {Routes, Route, useNavigate} from 'react-router-dom'
import QuizGamePortal from './pages/QuizGamePortal'
import CreateGamePage from './pages/CreateGamePage'
import LobbyPage from './pages/LobbyPage'
import PlayerLobbyPage from './pages/PlayerLobbyPage'
import GamePage from './pages/GamePage'
import ResultsPage from './pages/ResultsPage'
import {ClipLoader} from "react-spinners";
import {useGameStore} from "@/store/store.js";
import {requestRecoverGame} from "@/api/game.api.js";
import { io } from "socket.io-client";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
function App() {
    const {showLoading, setGameData, userId, setShowLoading, setUserId, setTeamMessages, gameData} = useGameStore();
    const navigate = useNavigate();

    useEffect(() => {
        if (userId) {
            setShowLoading(true);
            requestRecoverGame(userId)
                .then((result) => {
                    if (result && result.data) {
                        setGameData(result.data);
                        const gameState = result.data.state;
                        if (gameState === 'waiting') {
                            navigate('/lobby/' + result.data._id);
                            return;
                        }
                        if (gameState === 'started') {
                            navigate(`/game/${result.data._id}`);
                            return;
                        }
                        if (gameState === 'ended') {
                            navigate(`/results/${result.data._id}`);
                            setUserId(null);
                            return;
                        }
                    }
                })
                .catch(error => {
                    console.log(error);
                }).finally(() => {
                    setShowLoading(false);
            })
        }
    }, [userId]);

    useEffect(() => {
        if (userId) {
            const socket = io(import.meta.env.VITE_API_URL);
            socket.on('connect', async () => {
                socket.emit('joinRoom', {
                    userId
                })
            });
            socket.on('updateGame', data => {
                setGameData(data);
            });

            socket.on('updateMessages', data => {
                const {gameData, messages} = data;
                console.log('received messages:', messages, gameData);
                if (gameData) {
                    console.log('rendering messages');
                    const teams = gameData.teams;
                    const team = teams.find(team => team.members.map(member => member._id).includes(userId));
                    const teamMembers = team.members.map(member => member._id);
                    const teamMessages = messages.filter(message => teamMembers.includes(message.sender._id));
                    console.log(teamMessages);
                    setTeamMessages(teamMessages);
                }
            });

            document.addEventListener('sendMessage', (e) => {
               const message = e.detail.message;
               const gameId = e.detail.gameId;
               if (gameId) {
                   console.log('Sending message:', message);
                   socket.emit('sendMessage', {
                          userId,
                          gameId,
                          message
                   });
               }
            });
        }
    }, [userId]);


    return (
    <>
        {showLoading && (
            <div className={'fixed w-screen h-screen z-50 flex justify-center items-center bg-black opacity-50'}>
                <ClipLoader color={'#fff'}/>
            </div>
        )}

        <>
            <ToastContainer />
            <Routes>
                <Route path="/" element={<QuizGamePortal/>}/>
                <Route path="/create-game" element={<CreateGamePage />} />
                <Route path="/lobby/:gameId" element={<LobbyPage />} />
                <Route path="/player-lobby" element={<PlayerLobbyPage />} />
                <Route path="/game/:gameId" element={<GamePage />} />
                <Route path="/results/:gameId" element={<ResultsPage />} />
            </Routes>
        </>
    </>
  );
}

export default App