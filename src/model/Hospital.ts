import { System } from "./System";
import { User } from "./User";

export class Hospital {
  static instacia: Hospital;
  name: string;
  systems: System[];
  
  

  constructor(name: string) {
    if (!!Hospital.instacia) {
      return Hospital.instacia;
    }
    Hospital.instacia = this;
    this.name = name;
    //setear el entorno
    return this;
  }
  getUserLogin(): User {
    return this.userLoggin;
  }

  createAlert(doctorID: integer, patientID: integer) {}
  createDoctor() { }
  createEvolution(id Doctor, IDpatient) {
    //crear evolucio
    //verificarReglas---->>creatAlertas(idPaciente,IDdoctor,IdRegla)
   }
}

//const hospitalSystem = new Hospital();
