export class ContactPerson {
  id: number;
  name: string;
  lastName: string;
  dni: number;
  phone: number;
  constructor(
    id: number,
    name: string,
    lastName: string,
    dni: number,
    phone: number
  ) {
    this.id = id;
    this.name = name;
    this.lastName = lastName;
    this.dni = dni;
    this.phone = phone;
  }
}
