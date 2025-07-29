import { useEffect } from 'react';
import { useQuery, useMutation, useQueryClient, UseQueryOptions } from 'react-query';
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
  fetchUserById,
  editUserInfo,
  editTeamInfo,
  leaveTeam,
  fetchEventByID,
  fecthRules,
  editRules,
  acceptUser,
  fetchCurrentUserFull,
  fetchResults,
  uploadResults,
  deleteResults,
  fetchResultsTeamYears,
  fetchAI,
} from '../services/Api';
import {
  User,
  Teams,
  EventsListResponse,
  TeamsListResponse,
  UserListResponse,
  Me,
  RulesListResponse,
  Rules,
  Events,
  EditedRules,
  AccessMeRequest,
  Role,
  Question,
} from '../types';
import { useUserStore } from '@/store/userStore';
import notification from 'antd/es/notification';
import { AxiosError } from 'axios';
import message from 'antd/es/message';

export const defaultQueryOptions = {
  retry: false,
  refetchOnWindowFocus: false,
  refetchOnMount: false,
  refetchInterval: false,
} as const;

export const useCurrentUser = () => {
  const setCurrentUser = useUserStore((state) => state.setCurrentUser);
  const setTeamId = useUserStore((state) => state.setTeamId);

  return useQuery<Me>({
    queryKey: ['currentUser'],
    queryFn: fetchCurrentUser,
    ...defaultQueryOptions,
    onSuccess: (data) => {
      setCurrentUser(data);
      if (data?.team_id) {
        setTeamId(data.team_id);
      }
    },
  });
};

export const useCurrentUserFull = () => {
  return useQuery({
    queryKey: ['currentUserFull'],
    queryFn: fetchCurrentUserFull,
    ...defaultQueryOptions,
    retry: false,
  });
};

export const useTeamByCurrentUser = () => {
  const teamId = useUserStore((state) => state.teamId);

  return useQuery<Teams, AxiosError>({
    queryKey: ['team', teamId],
    queryFn: () => getTeamById(teamId!),
    ...defaultQueryOptions,
    enabled: !!teamId,
  });
};

export const useCtfQuery = () =>
  useQuery<EventsListResponse, AxiosError>(['ctfs'], fetchCTFs, defaultQueryOptions);

export const useTeamParticipantsQuery = () =>
  useQuery('teamParticipants', fetchTeamParticipants, defaultQueryOptions);

export const useTeamsQuery = () =>
  useQuery<TeamsListResponse>(['adminTeams'], fetchTeams, defaultQueryOptions);

export const useUsersQuery = (options?: UseQueryOptions<UserListResponse, Error>) =>
  useQuery<UserListResponse, Error>(['adminUsers'], fetchUsers, {
    ...defaultQueryOptions,
    ...options,
  });

export const useCreateCTF = () => {
  const qc = useQueryClient();

  return useMutation((ctfData: Events) => createCTF(ctfData), {
    onSuccess: () => {
      qc.invalidateQueries('ctfs');
      notification.success({
        message: 'CTF успешно создан',
        description: 'Новый CTF добавлен в список.',
        placement: 'topRight',
      });
    },
    onError: () => {
      notification.error({
        message: 'Ошибка при создании CTF',
        description: 'Попробуйте ещё раз.',
        placement: 'topRight',
      });
    },
  });
};

export const useEditUser = () => {
  const qc = useQueryClient();

  return useMutation((data: Me) => editUserInfo(data), {
    onSuccess: () => qc.invalidateQueries('me'),
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
  return useMutation(deleteCTF, { onSuccess: () => qc.invalidateQueries(['ctfs']) });
};

export const useCreateTeam = () => {
  const qc = useQueryClient();
  return useMutation((teamData: Partial<Teams>) => createTeam(teamData), {
    onSuccess: () => qc.invalidateQueries('teamParticipants'),
  });
};

export const useEditTeam = () => {
  const qc = useQueryClient();
  return useMutation(
    ({ teamId, data }: { teamId: string; data: Teams }) => editTeamInfo(teamId, data),
    {
      onSuccess: () => qc.invalidateQueries('teamParticipants'),
    },
  );
};

export const useJoinTeam = () => {
  const qc = useQueryClient();
  return useMutation(joinTeam, { onSuccess: () => qc.invalidateQueries('team') });
};

export const useUserById = (id: string) => {
  return useQuery<Me>({
    queryKey: ['user', id],
    queryFn: () => fetchUserById(id),
    enabled: !!id,
    ...defaultQueryOptions,
  });
};

export const useLeaveTeam = () => {
  const qc = useQueryClient();
  return useMutation((teamId: string) => leaveTeam(teamId), {
    onSuccess: () => qc.invalidateQueries('teamParticipants'),
  });
};

export const useEventById = (eventId?: string) =>
  useQuery(['event', eventId], () => fetchEventByID(eventId!), {
    enabled: !!eventId,
    ...defaultQueryOptions,
  });

export const useFetchRules = () => {
  const setRules = useUserStore((store) => store.setRules);

  const query = useQuery<Rules>({
    queryKey: ['rules'],
    queryFn: fecthRules,
    ...defaultQueryOptions,
  });

  useEffect(() => {
    if (query.data) {
      setRules(query.data.text);
    }
  }, [query.data, setRules]);

  return query;
};

export const useEditRules = () => {
  const qc = useQueryClient();
  return useMutation((editedRules: EditedRules) => editRules(editedRules), {
    onSuccess: () => qc.invalidateQueries('rules'),
  });
};

export const useAcceptUser = () => {
  const setCurrentUser = useUserStore((s) => s.setCurrentUser);
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (data: AccessMeRequest) => {
      await acceptUser(data);
      const user = await fetchCurrentUser();
      setCurrentUser(user);
      return user;
    },
    onSuccess: () => {
      qc.invalidateQueries('currentUser');
    },
  });
};

export const useUploadResults = () => {
  const qc = useQueryClient();
  return useMutation(
    ({ eventId, jsonData }: { eventId: string; jsonData: object }) =>
      uploadResults(eventId, jsonData),
    {
      onSuccess: () => {
        qc.invalidateQueries('results');
        qc.invalidateQueries('teamsRaiting');
      },
    },
  );
};

export const usefetchResults = ({ eventId }: { eventId: string }) => {
  return useQuery({
    queryKey: ['results', eventId],
    queryFn: () => fetchResults(eventId),
    enabled: !!eventId,
    ...defaultQueryOptions,
  });
};

export const useDeleteResults = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (eventId: string) => deleteResults(eventId),
    onSuccess: (_, eventId) => {
      qc.invalidateQueries({ queryKey: ['results', eventId] });
      qc.invalidateQueries('teamsRaiting');
      notification.success({
        message: 'Результаты успешно удалены',
        description: 'Результаты удалены',
        placement: 'topRight',
      });
    },
    onError: (error: any) => {
      console.error('Ошибка при удалении результатов:', error);
      notification.error({
        message: `Ошибка при удалении результатов: ${
          error.response?.data?.message || 'Неизвестная ошибка'
        }`,
        description: 'Ошибка при удалении результатов',
        placement: 'topRight',
      });
    },
  });
};

export const useTeamsRaiting = ({ year, page }: { year: number; page: number }) => {
  return useQuery({
    queryKey: ['teamsRaiting', year, page],
    queryFn: () => fetchResultsTeamYears(year, page),
    cacheTime: 0,
    staleTime: 0,
  });
};

export const useFetchAI = () => {
  return useMutation({
    mutationFn: ({
      role,
      session_id,
      message,
    }: {
      role: Role;
      session_id: string;
      message: Question;
    }) => fetchAI(role, session_id, message),
  });
};
