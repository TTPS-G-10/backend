import { Patient } from "./Patient";

export type Bed = {
  id: number;
  name: string;
  free: boolean;
  patientId: number;
  patient: Patient;
};
