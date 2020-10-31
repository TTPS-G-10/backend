import { Patient } from "./Patient";
export class Bed {
  id: number;
  name: string;
  free: boolean;
  patient: Patient;

  constructor(id: number, name: string) {
    this.id = id;
    this.name = name;
    this.free = true;
    this.patient = null;
  }

  assingPatient(patient: Patient): boolean {
    if (this.free) {
      this.patient = Patient;
      this.free = false;
      return true;
    }
    return false;
  }
  desasingPatient(): Patient {
    if (!this.free) {
      let patientDelete: Patient = this.assingPatient;
      this.patient = null;
      this.free = true;
      return patientDelete;
    }
  }
}
