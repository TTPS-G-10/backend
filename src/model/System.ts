import { Room } from "./Room";
import { Doctor } from "./Doctor";
export type System = {
  infinitBeds: boolean;
  totalBeds: number;
  ocupedBeds: number;
  freeBeds: number;
  occupancy: number;
  removable: boolean;
  rooms: Room[];
  doctors: Doctor[];
  SystemChief: Doctor;
  name: string;
  id: number;
};
