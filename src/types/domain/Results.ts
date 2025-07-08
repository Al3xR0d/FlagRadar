export interface ResultsListResponse {
  data: Results;
  msg: string;
  result: string;
}

export interface Results {
  links: string[];
  participants: Participants[];
  year: number;
  tasks: null | Tasks[];
}

interface Tasks {
  name: string;
  difficult: number;
  score: number;
  solves: number;
  category: string;
  competence: string[];
  competence_score: number[];
}

interface Participants {
  team_name: string;
  team_id: string;
  service_info: ServiceInfo[];
  score: number;
  place: number;
  members: Members[];
  add_score: number;
}

interface Members {
  attempts: null | Attempts[];
  is_qualified: boolean;
  username: string;
  solved_tasks: string[];
}

interface Attempts {
  task_name: string;
  num: number;
}

interface ServiceInfo {
  flags_capt: number;
  flags_lost: number;
  fp: number;
  name: string;
  sla: number;
}
