import { Patient } from "./Patient";
import { SystemChange } from "./SystemChange";
import { Location } from "./Location";
import { SystemNames } from "./System";

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

export enum InternmentStatuses {
  OBITO = "OBITO",
  EGRESS = "EGRESS",
  GUARDIA = "GUARDIA",
  UTI = "UTI",
  DOMICILIO = "DOMICILIO",
  PISO_COVID = "PISO COVID",
  HOTEL = "HOTEL",
}
