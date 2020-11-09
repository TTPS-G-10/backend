import { System } from "./System";

export type User = {
  name: string;
  lastName: string;
  password: string;
  role: string;
  email: string;
  id: number;
  systemId?: number;
  systemName?: string;
};
