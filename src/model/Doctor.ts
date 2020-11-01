
import { System } from "./System";
import { User } from "./User";

export type Doctor = User & {
  field: number;
  workIn: System;
  alerts: any[];
  online: boolean;
}
