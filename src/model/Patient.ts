import { ContactPerson } from "./ContactPerson";
import { Evolution } from "./Evolution";
export type Patient = {
  id: number;
  name: string;
  last_name: string;
  dni: number;
  birthDate: Date;
  direction: string;
  phone: number;
  email: string;
  socialSecurity: string;
  backgroundClinical: String;
  contactPerson?: ContactPerson;
  evolutions?: Evolution[];
};
