import { Room } from "./Room";
import { Doctor } from "./Doctor";
export type System = {
  infinitBed: boolean;
  totalBeds: number;
  freeBeds: number;
  rooms: Room[];
  doctors: Doctor[];
  SystemChief: Doctor;
  system_name: string;
}