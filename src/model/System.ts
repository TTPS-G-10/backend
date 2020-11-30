import { Room } from "./Room";
import { Doctor } from "./Doctor";

export enum SystemNames {
  GUARDIA = "GUARDIA",
  UTI = "UTI",
  DOMICILIO = "DOMICILIO",
  PISO_COVID = "PISO COVID",
  HOTEL = "HOTEL",
}

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
  name: SystemNames;
  id: number;
};
