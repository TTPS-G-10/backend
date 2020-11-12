import { Room } from "./Room";
import { Doctor } from "./Doctor";
export type System = {
  infinitBed: boolean;
  totalBeds: number;
  ocupedBeds: number;
  freeBeds: number;
  occupancy: number;
  retirable: boolean;
  rooms: Room[];
  doctors: Doctor[];
  SystemChief: Doctor;
  name: string;
  id: number;
};
