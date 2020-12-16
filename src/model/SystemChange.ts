import { Evolution } from "./Evolution";
export type SystemChange = {
  id: number;
  internmentId: number;
  systemId: number;
  systemName: string;
  createTime: Date;
  finish: boolean;
  evaluations: Evolution[];
};
