export interface Question {
  content: string;
}

export interface Answer {
  content: string;
}

export interface AnswerListResponse {
  result: string;
  msg: string;
  data: Answer;
}

export interface QuestionListResponse {
  role: Role;
  session_id: string;
  data: Question;
}

export type Role = 'blue' | 'red';
