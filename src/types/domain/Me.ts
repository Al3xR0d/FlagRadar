import { User } from '@/types/domain/User';

export interface MeListResponse {
  data: Me[];
  msg: string;
  result: string;
}

export interface Me extends User {}

export interface AccessMeRequest {
  nickname: string;
}
