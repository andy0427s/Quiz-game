import {Card, CardContent} from "@/components/ui/card.jsx";
import {ScrollArea} from "@/components/ui/scroll-area.jsx";
import {AnimatePresence, motion} from "framer-motion";
import {CheckCircle, Send} from "lucide-react";
import React from "react";
import {useGameStore} from "@/store/store.js";


const Team = ({team}) => {

    const { userId } = useGameStore();

    return (
        <div className="mb-4">
            <h3 className={`text-lg font-semibold mb-2 text-center `}>
                {team.name}
            </h3>
            <Card className={`bg-slate-700 border-none border-l-4 `}>
                <CardContent className="p-2">
                    <ScrollArea className="h-[120px] pr-4">
                        <AnimatePresence>
                            {team.members.map((player) => (
                                <motion.div
                                    key={player.username}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 20 }}
                                    transition={{ duration: 0.3 }}
                                    className="py-2 border-b border-slate-600 last:border-b-0 flex justify-between items-center"
                                >
                    <span className="text-slate-200 flex items-center">
                      {player.username}
                        {player._id === userId && <span className="ml-2 text-slate-200">(You)</span>}

                    </span>
                                    <CheckCircle className="text-teal-400" />
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </ScrollArea>
                </CardContent>
            </Card>
        </div>
    );
}


const TeamsPanel = ({teams = []}) => {
    return (
        <div className={`grid grid-cols-${teams.length} gap-4 w-full`}>
            {teams.map((team) => (
                <div key={team._id} className={'col-span-1'}>
                    <Team team={team} />
                </div>
            ))}
        </div>
    )
}

export default TeamsPanel;