// export const API_BASE_URL = 'http://10.67.0.89:9999/sbcsm_flagradar/api/v2';
// export const API_BASE_URL = 'sbcsm_flagradar/api/v1';
// export const API_BASE_URL = 'http://141.101.151.37:9999/sbcsm_flagradar/api/v1';

const BASE_HOST = import.meta.env.VITE_API_URL;
const API_BASE_PATH = '/sbcsm_flagradar/api/v1';

export const ME_URL = `/me`;
export const EVENTS_URL = `/events`;
export const TEAM_URL = `/teams`;
export const USER_URL = `/users`;
export const RULES_URL = `/rules`;
export const RAITING_URL = `/rating`;
export const AI_URL = `assistant/question`;
export const TEAM_PARTICIPANTS_URL = `/participants`;
export const ADMIN_TEAMS_URL = `/admin/teams`;
export const ADMIN_USERS_URL = `/admin/users`;
export const MAIL_URL = '/mail';
