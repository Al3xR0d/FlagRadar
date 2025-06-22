import { useQuery, useMutation, useQueryClient } from 'react-query';
import {
  fetchTeamParticipants,
  fetchTeams,
  fetchUsers,
  fetchCTFs,
  joinCTF,
  leaveCTF,
  editCTF,
  deleteCTF,
  joinTeam,
  createTeam,
  createCTF,
  fetchCurrentUser,
  getTeamById,
} from '../services/Api';
import { Events } from '@/types/domain/Events';
import { User, Teams, EventsListResponse, TeamsListResponse, UserListResponse, Me } from '../types';
import { useUserStore } from '@/store/userStore';

const defaultQueryOptions = {
  retry: false,
  refetchOnWindowFocus: false,
  refetchOnMount: false,
  refetchInterval: false,
} as const;

export const useCurrentUser = () => {
  const setTeamId = useUserStore((state) => state.setTeamId);

  return useQuery<Me>({
    queryKey: ['currentUser'],
    queryFn: fetchCurrentUser,
    ...defaultQueryOptions,
    onSuccess: (data) => {
      if (data?.team_id) {
        setTeamId(data.team_id);
      }
    },
  });
};

export const useTeamByCurrentUser = () => {
  const teamId = useUserStore((state) => state.teamId);

  return useQuery({
    queryKey: ['team', teamId],
    queryFn: () => getTeamById(teamId!),
    ...defaultQueryOptions,
    enabled: !!teamId,
  });
};

export const useCtfQuery = () =>
  useQuery<EventsListResponse>(['ctf'], fetchCTFs, defaultQueryOptions);

export const useTeamParticipantsQuery = () =>
  useQuery('teamParticipants', fetchTeamParticipants, defaultQueryOptions);

export const useTeamsQuery = () =>
  useQuery<TeamsListResponse>(['adminTeams'], fetchTeams, defaultQueryOptions);

export const useUsersQuery = () =>
  useQuery<UserListResponse>(['adminUsers'], fetchUsers, defaultQueryOptions);

export const useCreateCTF = () => {
  const qc = useQueryClient();

  return useMutation((ctfData: Events) => createCTF(ctfData), {
    onSuccess: () => qc.invalidateQueries('ctfs'),
  });
};

export const useJoinCTF = () => {
  const qc = useQueryClient();
  return useMutation(joinCTF, { onSuccess: () => qc.invalidateQueries('ctfs') });
};

export const useLeaveCTF = () => {
  const qc = useQueryClient();
  return useMutation(leaveCTF, { onSuccess: () => qc.invalidateQueries('ctfs') });
};

export const useEditCTF = () => {
  const qc = useQueryClient();
  return useMutation(({ id, data }: { id: string; data: Events }) => editCTF(id, data), {
    onSuccess: () => qc.invalidateQueries('ctfs'),
  });
};

export const useDeleteCTF = () => {
  const qc = useQueryClient();
  return useMutation(deleteCTF, { onSuccess: () => qc.invalidateQueries('ctfs') });
};

export const useCreateTeam = () => {
  const qc = useQueryClient();
  return useMutation((teamData: Partial<Teams>) => createTeam(teamData), {
    onSuccess: () => qc.invalidateQueries('teamParticipants'),
  });
};

export const useJoinTeam = () => {
  const qc = useQueryClient();
  return useMutation(joinTeam, { onSuccess: () => qc.invalidateQueries('teamParticipants') });
};
