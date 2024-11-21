import { create } from 'zustand'
import {createJSONStorage, persist} from 'zustand/middleware'

export const useGameStore = create(
    persist(
        (set) => {
            return {
                gameData: null,
                userId: null,
                showLoading: false,
                teamMessages: [],

                setUserId: (userId) => set({ userId }),
                setGameData: (gameData) => set({ gameData }),
                setShowLoading: (showLoading) => set({ showLoading }),
                setTeamMessages: (teamMessages) => set({ teamMessages }),
            }
        },
        {
            name: 'game-storage',
            storage: createJSONStorage(( ) => localStorage),
            partialize: (state) => ({ userId: state.userId })
        }
    )
);