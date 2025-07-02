import { User } from '@/types/domain/User';

export interface MeListResponse {
  data: Me[];
  msg: string;
  result: string;
}

// export interface Me {
//   description: string;
//   email: string;
//   events: string[];
//   jwt: string;
//   nickname: string;
//   properties: string;
//   sber_pdi: string;
//   score_bb: number;
//   score_ctf: number;
//   team_id: string;
//   uuid: string;
// }

export interface Me extends User {}

export interface AccessMeRequest {
  nickname: string;
}
