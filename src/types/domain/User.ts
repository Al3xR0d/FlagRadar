export interface User {
  sber_pdi: string;
  uuid: string;
  login: string;
  properties: string;
  score_bb: number;
  score_ctf: number;
  team_id: string;
  events: string[];
}

export interface UserListResponse {
  result: string;
  data: User[];
  masg: string;
}
