import { Bed } from "./Bed";
export class Room {
  name: string;
  beds: Bed[];
  //listarCamas
  //addCama

  constructor(name: string) {
    this.name = name;
    this.beds = [];
  }
}
