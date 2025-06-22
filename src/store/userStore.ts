import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface UserState {
  teamId: string | null;
  setTeamId: (id: string | null) => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      teamId: null,
      setTeamId: (id) => set({ teamId: id }),
    }),
    {
      name: 'user-store',
    },
  ),
);
