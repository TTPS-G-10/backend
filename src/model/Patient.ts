import { ContactPerson } from "./ContactPerson";
import { Evolution } from "./Evolution";
export type Patient = {
  id: number;
  name: string;
  lastName: string;
  dni: number;
  birthDate: Date;
  direction: string;
  phone: number;
  email: string;
  socialSecurity: string;
  backgroundClinical: String;
  contactPerson: ContactPerson;
  evolutions: Evolution[];
}
