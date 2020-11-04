import { Patient } from "./Patient";

export type Bed = {
  id: number;
  name: string;
  free: boolean;
  patient: Patient;
}
