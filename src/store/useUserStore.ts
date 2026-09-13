import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface UserSkills {
  superposition: number;
  entanglement: number;
  phaseLogic: number;
  measurement: number;
  algorithms: number;
}

export interface UserState {
  xp: number;
  completedLessons: string[];
  completedLabs: string[];
  streak: number;
  skills: UserSkills;
  recentAchievements: string[];
  lastDailyCompleted: string | null;
  hasSeenTour: boolean;
  
  completeLesson: (slug: string) => void;
  completeLab: (slug: string) => void;
  addAchievement: (achievement: string) => void;
  incrementSkill: (skill: keyof UserSkills, amount?: number) => void;
  claimDailyReward: () => void;
  setHasSeenTour: () => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      xp: 0,
      completedLessons: [],
      completedLabs: [],
      streak: 1, // Mocked starting streak
      skills: {
        superposition: 0,
        entanglement: 0,
        phaseLogic: 0,
        measurement: 0,
        algorithms: 0,
      },
      recentAchievements: ["Welcome to Quantum Base"],
      lastDailyCompleted: null,
      hasSeenTour: false,

      setHasSeenTour: () => set({ hasSeenTour: true }),

      claimDailyReward: () => 
        set((state) => {
          const today = new Date().toDateString();
          if (state.lastDailyCompleted === today) return state; // Already claimed

          // Update streak if it was yesterday
          const yesterday = new Date();
          yesterday.setDate(yesterday.getDate() - 1);
          const isConsecutive = state.lastDailyCompleted === yesterday.toDateString();
          
          return {
            lastDailyCompleted: today,
            xp: state.xp + 500,
            streak: isConsecutive ? state.streak + 1 : 1,
            recentAchievements: ["Daily Challenge Completed!", ...state.recentAchievements].slice(0, 10),
          };
        }),

      completeLesson: (slug) =>
        set((state) => {
          if (state.completedLessons.includes(slug)) return state;
          return {
            completedLessons: [...state.completedLessons, slug],
            xp: state.xp + 100,
          };
        }),

      completeLab: (slug) =>
        set((state) => {
          if (state.completedLabs.includes(slug)) return state;
          return {
            completedLabs: [...state.completedLabs, slug],
            xp: state.xp + 250, // Labs give more XP
          };
        }),

      addAchievement: (achievement) =>
        set((state) => {
          if (state.recentAchievements.includes(achievement)) return state;
          return {
            recentAchievements: [achievement, ...state.recentAchievements].slice(0, 10), // Keep last 10
          };
        }),

      incrementSkill: (skill, amount = 5) =>
        set((state) => ({
          skills: {
            ...state.skills,
            [skill]: Math.min(100, state.skills[skill] + amount), // Max skill 100
          },
        })),
    }),
    {
      name: "quantum-user-storage", // unique name
    }
  )
);
