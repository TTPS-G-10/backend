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

export type Evolution = {
  editStatus: boolean;
  timing: number;
  autor: number;
  vitalsigns: {
    temperature: number;
    TASistolica: number;
    TADiastolica: number;
    FC: number;
    FR: number;
  };
  respiratorySystem: {
    ventilatoryMechanics: MechanicType;
    O2Suplementary: {
      done: boolean;
      type?: O2SupplementaryType;
      value?: number;
    };
    saturacionO2: number;
    pafi: { done: boolean; value?: number };
    tos: boolean;
    disnea: number;
    stabilitySymptoms: boolean;
  };
  otherSymptoms: { drowsiness: boolean; anosmia: boolean; dysgeusia: boolean };
  HOYStudies: {
    RxTx: ClinicalStuides;
    TAC: ClinicalStuides;
    ECG: ClinicalStuides;
    PCR: ClinicalStuides;
  };
  observations: string;
  uti: {
    ARM: boolean;
    descriptionARM: string;
    tracheotomy: boolean;
    vasopressors: boolean;
    descriptionVasopressors: string;
  };
}
