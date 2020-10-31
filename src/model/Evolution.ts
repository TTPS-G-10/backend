type ClinicalStuides = {
  done: boolean;
  type?: ClinicalStuidesType;
  description?: string;
};
enum MechanicType {
  "Buena",
  "Regular",
  "Mala",
}
enum ClinicalStuidesType {
  "Buena",
  "Regular",
  "Mala",
}
enum O2SupplementaryType {
  "Canula nasal",
  "Mascara con Reservorio",
}

export class Evolution {
  static editStatus: boolean = false;
  static timing: number = 0;
  autor: number;
  signosVitales: {
    temperatura: number;
    TASistolica: number;
    TADiastolica: number;
    FC: number;
    FR: number;
  };
  sistemaRespitarorio: {
    mecanicaVentilatoria: MechanicType;
    O2Suplementario: {
      done: boolean;
      type?: O2SupplementaryType;
      value?: number;
    };
    saturacionO2: number;
    pafi: { done: boolean; value?: number };
    tos: boolean;
    disnea: number;
    estabilidadSintomas: boolean;
  };
  otrosSintomas: { somnolencia: boolean; anosmia: boolean; disgeusia: boolean };
  estudiosHoy: {
    RxTx: ClinicalStuides;
    TAC: ClinicalStuides;
    ECG: ClinicalStuides;
    PCR: ClinicalStuides;
  };
  observaciones: string;
  uti: {
    ARM: boolean;
    descriptionARM: string;
    traqueotomia: boolean;
    vasopresores: boolean;
    descriptionVasopresores: string;
  };

  static getEditStatus(): boolean {
    return this.editStatus;
  }
  static setEditStatus = (value: boolean) => {
    Evolution.editStatus = value;
  };


  constructor(idAutor: number,idPatient:number) {
    this.autor = idAutor;
//resto de los campos
    
  }
  /setear todos los valores por defecto
  //verEvolucion
}
