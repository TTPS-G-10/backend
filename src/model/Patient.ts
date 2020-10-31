import { ContactPerson } from "./ContactPerson";
import { Evolution } from "./Evolution";
export class Patient {
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

  constructor(
    id: number,
    name: string,
    lastName: string,
    dni: number,
    birthDate: Date,
    direction: string,
    phone: number,
    email: string,
    socialSecurity: string,
    backgroundClinical: String,
    contactPerson: ContactPerson
  ) {
    this.id = id;
    this.name = name;
    this.lastName = lastName;
    this.dni = dni;
    this.birthDate = birthDate;
    this.direction = direction;
    this.phone = phone;
    this.email = email;
    this.socialSecurity = socialSecurity;
    this.backgroundClinical = backgroundClinical;
    this.contactPerson = contactPerson;
    this.evolutions = [];
  }
}
