import { User } from "./User";

export class RulesChief extends User {
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

  addRule() {}
  turOnRule() {}
  turOffRule() {}
  listRules() {}
}
