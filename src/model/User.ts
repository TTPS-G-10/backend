export enum Role {
  Doctor = "DOCTOR",
  Admin = "ADMIN",
  SystemChief = "JEFE DE SISTEMA",
  SystemRule = "ADMINISTRADOR DE REGLAS",
}

export type User = {
  name: string;
  lastName: string;
  password: string;
  role: Role;
  email: string;
  id: number;
  systemId?: number;
  systemName?: string;
};
