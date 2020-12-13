export type Alert = {
  ruleName: string;
  evaluationId: number;
  date: Date;
  name: string;
  message: string;
  userId: number;
  readByUser: boolean;
};
