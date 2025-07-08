export const enum EventsFormat {
  ONLINE = 'online',
  OFFLINE = 'offline',
}

export const enum EventsStatus {
  ACTIVE = 'active',
  PENDING = 'pending',
  FINISHED = 'finished',
  CANCELLED = 'cancelled',
  REGISTRATION = 'registration',
}

export interface Events {
  date: string;
  date_end: string;
  description: string;
  event_format: string;
  is_private: boolean;
  member_limit: number;
  name: string;
  part_format: string;
  place: string;
  ref_rules: string;
  reg_end: string;
  reg_start: string;
  team_limit: number;
  tokens: string[] | null;
  uuid: string;
}

export interface EventsListResponse {
  data: Events[];
  msg: string;
  result: string;
}
