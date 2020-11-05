import { Bed } from "./Bed";
import { Patient } from "./Patient";
export type Room = {
  name: string;
  beds: Bed[];
  id: number;
};
