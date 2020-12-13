import { KnownRulesKeys } from "./Rule";

export type Alert = {
  ruleName: string;
  ruleKey: KnownRulesKeys;
  evaluationId: number;
  date: Date;
  name: string;
  message: string;
  userId: number;
  readByUser: boolean;
};
