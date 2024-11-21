import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card.jsx";
import {ScrollArea} from "@/components/ui/scroll-area.jsx";
import {Input} from "@/components/ui/input.jsx";
import {Button} from "@/components/ui/button.jsx";
import {Send, Trophy} from "lucide-react";
import {motion} from "framer-motion";
import React, {useRef, useState} from "react";
import {useGameStore} from "@/store/store.js";


const ChatRoom = () => {
    const {gameData, teamMessages} = useGameStore();
    const [currentMessage, setCurrentMessage] = useState('')
    const chatRef = useRef(null);
    const handleSendMessage = () => {

        try {
            const sendMessageEvent = new CustomEvent('sendMessage', {
                detail: {
                    message: currentMessage,
                    gameId: gameData._id
                }
            });
            document.dispatchEvent(sendMessageEvent);
            setCurrentMessage('')
        } catch (error) {
            console.log(error);
        }
    }

    if (!gameData) {
        return <></>;
    }

    const teamsScore = gameData.teamsScore.sort((a, b) => b.score - a.score);
    return (
        <div className="w-full max-w-6xl grid grid-cols-2 gap-4">
            <Card className="bg-slate-800/90 backdrop-blur-md border-none text-slate-100">
                <CardHeader>
                    <CardTitle className="text-xl flex items-center justify-center text-teal-300">
                        Team Chat
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <ScrollArea className="h-[200px] mb-4" ref={chatRef}>
                        {teamMessages.map((message, index) => (
                            <div key={index} className="mb-2">
                                <span className="font-bold text-indigo-300">{message.sender.username}: </span>
                                <span className="text-slate-200">{message.message}</span>
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
                            <Send className="h-4 w-4"/>
                        </Button>
                    </div>
                </CardContent>
            </Card>
            <Card className="bg-slate-800/90 backdrop-blur-md border-none text-slate-100">
                <CardHeader>
                    <CardTitle className="text-xl flex items-center justify-center text-teal-300">
                        <Trophy className="mr-2"/> Team Leaderboard
                    </CardTitle>
                </CardHeader>
                <CardContent>

                    {!gameData.showLeaderboard && (
                        <div className="text-center text-slate-200 my-3">Leaderboard will be shown after the game</div>
                    )}

                    {gameData.showLeaderboard && (
                        <>
                            <ScrollArea className="h-[200px]">
                                {teamsScore.map((team, index) => (
                                    <motion.div
                                        key={team.team}
                                        initial={{opacity: 0, x: 20}}
                                        animate={{opacity: 1, x: 0}}
                                        transition={{delay: index * 0.1}}
                                        className="py-2 border-b border-slate-600 last:border-b-0 flex justify-between items-center"
                                    >
                  <span className={`font-semibold ${index === 0 ? "text-teal-300" : "text-indigo-300"}`}>
                    {team.team}
                  </span>
                                        <span className="font-bold text-slate-200">{team.score}</span>
                                    </motion.div>
                                ))}
                            </ScrollArea>
                        </>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
export default ChatRoom;