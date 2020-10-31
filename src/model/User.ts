export class User {
  name: string;
  lastname: string;
  password: string;
  role: string;
  email: string;
  id: number;
  constructor(
    name: string,
    lastname: string,
    password: string,
    role: string,
    email: string,
    id: number
  ) {
    this.name = name;
    this.lastname = lastname;
    this.password = password;
    this.role = role;
    this.email = email;
    this.id = id;
  }
  //getters ande setters
}
