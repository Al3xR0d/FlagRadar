export interface Teams {
  members: string[];
  name: string;
  score_bb: number;
  score_ctf: number;
  token: string;
  uuid: string;
}

export interface TeamsListResponse {
  data: Teams[];
  msg: string;
  result: string;
}

export interface EditTeam {
  nickname: string;
}

export interface AddTeam {
  name: string;
  member_counts: number;
  event_uuid: string;
}
