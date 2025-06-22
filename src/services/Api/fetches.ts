import {
  TeamsListResponse,
  UserListResponse,
  EventsListResponse,
  Events,
  Teams,
  Me,
} from '@/types';
import {
  EVENTS_URL,
  TEAM_PARTICIPANTS_URL,
  ADMIN_TEAMS_URL,
  ADMIN_USERS_URL,
  ME_URL,
  USER_URL,
  TEAM_URL,
} from './url';
import { api } from './api';

export const fetchCurrentUser = async (): Promise<Me> => {
  const response = await api.GET(ME_URL);
  return response.data;
};

export const fetchCTFs = async (): Promise<EventsListResponse> => api.GET(EVENTS_URL);

export const createCTF = (data: Events) => api.POST<EventsListResponse>(EVENTS_URL, data);
export const joinCTF = (token: string) => api.POST(`${EVENTS_URL}/join`, { token });
export const leaveCTF = () => api.POST(`${EVENTS_URL}/leave`);
export const editCTF = (id: string, data: Events) =>
  api.PUT<EventsListResponse>(`${EVENTS_URL}/${id}`, data);
export const deleteCTF = (id: string) => api.DELETE<void>(`${EVENTS_URL}/${id}`);

export const fetchTeamParticipants = () => api.GET<UserListResponse>(TEAM_PARTICIPANTS_URL);

export const fetchTeams = async (): Promise<TeamsListResponse> => api.GET(TEAM_URL);
export const fetchUsers = async (): Promise<UserListResponse> => api.GET(USER_URL);
export const getTeamById = async (teamId: string): Promise<Teams> => {
  const response = await api.GET(`${TEAM_URL}/${teamId}`);
  return response.data;
};

export const createTeam = (data: Partial<Teams>) =>
  api.POST<TeamsListResponse>(ADMIN_TEAMS_URL, data);
export const joinTeam = (teamId: string) => api.POST(`${ADMIN_TEAMS_URL}/${teamId}/join`);
