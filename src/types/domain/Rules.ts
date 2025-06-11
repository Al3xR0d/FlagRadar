export interface Rules {
  rule_ver: number;
  text: string;
}

export interface RulesListResponse {
  result: string;
  msg: string;
  data: Rules[];
}

export interface EditedRules {
  reaccept: boolean;
  text: string;
}
