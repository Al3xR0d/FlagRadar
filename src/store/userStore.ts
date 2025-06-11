import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Me } from '@/types';

interface UserState {
  currentUser: Me | null;
  setCurrentUser: (user: Me) => void;
  teamId: string | null;
  setTeamId: (id: string | null) => void;
  rules: string | null;
  setRules: (rule: string) => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      currentUser: null,
      setCurrentUser: (user) => set({ currentUser: user }),
      teamId: null,
      setTeamId: (id) => set({ teamId: id }),
      rules: null,
      setRules: (rule) => set({ rules: rule }),
    }),
    {
      name: 'user-store',
    },
  ),
);
