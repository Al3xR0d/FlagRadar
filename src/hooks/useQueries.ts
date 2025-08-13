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
  sendMail,
  deligateCaptain,
  demoteMember,
  deleteTeam,
  createJWT,
  addTeam,
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
  Mail,
  EditTeam,
  AddTeam,
} from '../types';
import { useUserStore } from '@/store/userStore';
import notification from 'antd/es/notification';
import { AxiosError } from 'axios';
import message from 'antd/es/message';
import { error } from 'console';

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
      onSuccess: () => {
        qc.invalidateQueries('teamParticipants');
        notification.success({
          message: 'Команда отредактирована',
          placement: 'topRight',
        });
      },
      onError: (error: any) => {
        notification.error({
          message: `Ошибка при редактировании команды: ${
            error.response?.data || 'Неизвестная ошибка'
          }`,
          description: 'Ошибка при редактировании команды',
          placement: 'topRight',
        });
      },
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
  const clearTeamId = useUserStore((s) => s.clearTeamId);

  return useMutation((teamId: string) => leaveTeam(teamId), {
    onSuccess: () => {
      clearTeamId();
      qc.invalidateQueries('teamParticipants');
    },
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
        message: `Ошибка при удалении результатов: ${error.response?.data || 'Неизвестная ошибка'}`,
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
      content,
    }: {
      role: Role;
      session_id: string;
      content: string;
    }) => fetchAI(role, session_id, content),
  });
};

export const useSendMail = () => {
  return useMutation({
    mutationFn: ({ eventId, data }: { eventId: string; data: Mail }) => sendMail({ eventId, data }),
    onSuccess: () => {
      notification.success({
        message: 'Сообщение направлено',
        placement: 'topRight',
      });
    },
    onError: (error: any) => {
      notification.error({
        message: `Ошибка при направлении сообщения: ${
          error.response?.data || 'Неизвестная ошибка'
        }`,
        description: 'Ошибка при направлении сообщения',
        placement: 'topRight',
      });
    },
  });
};

export const useDeligateCaptain = () => {
  const qc = useQueryClient();
  const setCurrentUser = useUserStore((store) => store.setCurrentUser);

  return useMutation(
    ({ teamId, data }: { teamId: string; data: EditTeam }) => deligateCaptain({ teamId, data }),
    {
      onSuccess: async () => {
        qc.invalidateQueries('teamParticipants');
        qc.invalidateQueries('currentUser');
        qc.invalidateQueries('currentUserFull');

        try {
          const fresh = await fetchCurrentUser();
          setCurrentUser(fresh);
        } catch (err) {
          console.error('Failed to refetch current user after delegate captain', err);
        }

        notification.success({
          message: 'Права капитана переданы',
          placement: 'topRight',
        });
      },
      onError: (error: any) => {
        notification.error({
          message: `Ошибка при передачи прав капитана: ${
            error.response?.data || 'Неизвестная ошибка'
          }`,
          description: 'Ошибка при передачи прав капитана',
          placement: 'topRight',
        });
      },
    },
  );
};

export const useDemoteMember = () => {
  const qc = useQueryClient();
  return useMutation(
    ({ teamId, data }: { teamId: string; data: EditTeam }) => demoteMember({ teamId, data }),
    {
      onSuccess: () => {
        qc.invalidateQueries('teamParticipants');
        qc.invalidateQueries('team');
        notification.success({
          message: 'Участник разжалован',
          placement: 'topRight',
        });
      },
      onError: (error: any) => {
        notification.error({
          message: `Ошибка при разжаловании участника: ${
            error.response?.data || 'Неизвестная ошибка'
          }`,
          description: 'Ошибка при разжаловании участника',
          placement: 'topRight',
        });
      },
    },
  );
};

export const useDeleteTeam = () => {
  const qc = useQueryClient();
  const clearTeamId = useUserStore((s) => s.clearTeamId);

  return useMutation(deleteTeam, {
    onSuccess: () => {
      clearTeamId();
      qc.invalidateQueries('teamParticipants');
      notification.success({
        message: 'Команда удалена',
        placement: 'topRight',
      });
    },
    onError: (error: any) => {
      notification.error({
        message: `Ошибка при удалении команды: ${error.response?.data || 'Неизвестная ошибка'}`,
        description: 'Ошибка при удалении команды',
        placement: 'topRight',
      });
    },
  });
};

export const useCreateJWT = () => {
  return useMutation((teamId: string) => createJWT(teamId));
};

export const useAddTeam = () => {
  const qc = useQueryClient();
  return useMutation((data: AddTeam) => addTeam(data), {
    onSuccess: () => {
      qc.invalidateQueries('teamParticipants');
      qc.invalidateQueries('adminTeams');
      qc.invalidateQueries('adminUsers');
      qc.invalidateQueries('team');
      notification.success({
        message: 'Команда добавлена',
        placement: 'topRight',
      });
    },
    onError: (error: any) => {
      notification.error({
        message: `Ошибка при добавлении команды: ${error.response?.data || 'Неизвестная ошибка'}`,
        description: 'Ошибка при добавлении команды',
        placement: 'topRight',
      });
    },
  });
};
