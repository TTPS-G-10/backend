import { Room } from "./Room";
import { Doctor } from "./Doctor";
export class System {
  infinitBed: boolean;
  totalBeds: number;
  freeBeds: number;
  rooms: Room[];
  doctors: Doctor[];
  SystemChief: Doctor;

  constructor() {
    this.infinitBed = false;
    this.totalBeds = 0;
    this.freeBeds = 0;
    this.rooms = [];
    this.doctors = [];
    this.SystemChief = null;
  }

  //listarSalas();
  //consultarSalas()
}
