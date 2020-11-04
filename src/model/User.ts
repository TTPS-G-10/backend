import { System } from "./System";

export type User = {
  name: string;
  lastname: string;
  password: string;
  role: string;
  email: string;
  id: number;
  system?: string;
};
