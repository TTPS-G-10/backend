import { Patient } from "./Patient";
import { SystemChange } from "./SystemChange";
import { Location } from "./Location";

export type Internment = {
  id: number;
  historyOfDisease: string;
  dateOfSymptoms: Date;
  dateOfDiagnosis: Date;
  dateOfHospitalization: Date;
  egressDate: Date;
  obitoDate: Date;
  patientId: number;
  patient: Patient;
  location: Location;
  systemChanges: SystemChange[];
};
