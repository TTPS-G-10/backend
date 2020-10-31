import { Alert } from "./Alert";
import { System } from "./System";
import { User } from "./User";

export class Doctor extends User {
  fiel: number;
  workIn: System;
  alerts: any[];
  online: boolean;
  constructor(
    id: number,
    name: string,
    lastname: string,
    email: string,
    password: string,
    role: string,
    field: number,
    workIn: System
  ) {
    super(name, lastname, password, role, email, id);

    this.fiel = field;
    this.workIn = workIn;
    this.alerts = [];
    this.online = false;
  }

  //sistemInWork;(?)

  //evolucionarPaciente()
  //listarSistemas()
  //ingresarPAciente()

  //listAlerts
  addAlert(alert: Alert) {
    this.alerts.push(Alert);
  }
}
