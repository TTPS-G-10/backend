import { Doctor } from "./Doctor";
import { System } from "./System";
import { User } from "./User";

export class Admin extends User {
  constructor(
    name: string,
    lastname: string,
    password: string,
    role: string,
    email: string,
    id: number
  ) {
    super(name, lastname, password, role, email, id);
  }
  addDoctor(doctor: Doctor);
  addSystem(system: System);
  editDoctor(doctor: Doctor);
  setEvaluations(evaluation: Evaluation);
}
