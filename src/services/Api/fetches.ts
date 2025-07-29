import {
  TeamsListResponse,
  UserListResponse,
  EventsListResponse,
  Events,
  Teams,
  Me,
  Rules,
  EditedRules,
  AccessMeRequest,
  MeListResponse,
  ResultsListResponse,
  ResultsTeamsYearsResponse,
  Answer,
  Role,
  Question,
  AnswerListResponse,
} from '@/types';
import {
  EVENTS_URL,
  TEAM_PARTICIPANTS_URL,
  ME_URL,
  USER_URL,
  TEAM_URL,
  RULES_URL,
  RAITING_URL,
  AI_URL,
} from './url';
import { api } from './api';

interface FetchResultsParams {
  eventId: string;
  formData: FormData;
}

export const fetchCurrentUser = async (): Promise<Me> => {
  const response = await api.GET(ME_URL);
  return response.data;
};
export const fetchCurrentUserFull = async (): Promise<MeListResponse> => {
  return api.GET(ME_URL);
};

export const fetchCTFs = async (): Promise<EventsListResponse> => api.GET(EVENTS_URL);

export const createCTF = (data: Events) => api.POST<EventsListResponse>(EVENTS_URL, data);
export const joinCTF = ({ eventId, token }: { eventId: string; token: string }) =>
  api.POST(`${EVENTS_URL}/${eventId}/join`, { token });
export const leaveCTF = (eventId: string) =>
  api.POST(`${EVENTS_URL}/${eventId}/leave`, { eventId });
export const editCTF = (id: string, data: Events) =>
  api.PATCH<EventsListResponse>(`${EVENTS_URL}/${id}`, data);

// export const deleteCTF = (uuid: string) => api.POST(`${EVENTS_URL}/delete`, { uuid: uuid });
export const deleteCTF = (uuid: string) => api.DELETE(`${EVENTS_URL}/${uuid}`);

export const fetchTeamParticipants = () => api.GET<UserListResponse>(TEAM_PARTICIPANTS_URL);

export const fetchTeams = async (): Promise<TeamsListResponse> => api.GET(TEAM_URL);
export const fetchUsers = async (): Promise<UserListResponse> => api.GET(USER_URL);
export const getTeamById = async (teamId: string): Promise<Teams> => {
  const response = await api.GET(`${TEAM_URL}/${teamId}`);
  return response.data;
};

export const createTeam = (name: Partial<Teams>) => api.POST<TeamsListResponse>(TEAM_URL, name);
export const joinTeam = (token: string) => api.POST(`${TEAM_URL}/join`, { token: token });

export const fetchUserById = async (id: string): Promise<Me> => {
  const response = await api.GET(`${USER_URL}/${id}`);
  return response.data;
};
export const editUserInfo = (data: Me) => api.POST(ME_URL, data);
export const editTeamInfo = (teamId: string, data: Teams) =>
  api.PATCH(`${TEAM_URL}/${teamId}`, data);
export const leaveTeam = (teamId: string) => api.POST(`${TEAM_URL}/${teamId}/leave`);
export const fetchEventByID = async (eventId: string): Promise<Events> => {
  const response = await api.GET(`${EVENTS_URL}/${eventId}`);
  return response.data;
};
export const fecthRules = async (): Promise<Rules> => {
  const response = await api.GET(RULES_URL);
  return response.data;
};
export const editRules = (data: EditedRules) => api.POST(RULES_URL, data);
export const acceptUser = (data: AccessMeRequest) => api.POST(`${RULES_URL}/accept`, data);
export const fetchResults = async (eventId: string): Promise<ResultsListResponse> => {
  const response = await api.GET(`${EVENTS_URL}/${eventId}/results`);
  return response;
};
export const uploadResults = (eventId: string, jsonData: object) => {
  return api.POST(`${EVENTS_URL}/${eventId}/results`, jsonData, {
    headers: {
      'Content-Type': 'application/json',
    },
  });
};
export const deleteResults = (eventId: string) => api.DELETE(`${EVENTS_URL}/${eventId}/results`);
export const fetchResultsTeamYears = async (
  year: number,
  page: number,
): Promise<ResultsTeamsYearsResponse> => api.GET(`${RAITING_URL}/teams?year=${year}&page=${page}`);
export const fetchAI = async (
  role: Role,
  session_id: string,
  message: Question,
): Promise<AnswerListResponse> => api.POST(`${AI_URL}`, { role, session_id, message });
