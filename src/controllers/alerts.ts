import { Response, Request } from "express";
import EngineRule from "../rule-engine/engine";
import { EngineResult, Event } from "json-rules-engine";
import genNewAlerts from "../services/genNewAlerts";

const getAlerts = async (req: Request, res: Response) => {
  const engine = EngineRule.getEngine();
  const patientsEvaluationFacts: {
    patient_name: string;
    patient_id: number;
    facts: { [key: string]: any };
  }[] = [
    {
      patient_name: "Juan Nicolás",
      patient_id: 1,
      facts: {
        somnolencia: true,
        mecanica_ventilatoria: "regular",
        frecuencia_respiratoria: 61,
        saturación_de_oxígeno: 90,
      },
    },
    {
      patient_name: "Luciano Pérez Cerra",
      patient_id: 2,
      facts: {
        somnolencia: true,
      },
    },
  ];
  const generatedAlerts = await genNewAlerts(patientsEvaluationFacts);
  const unReadAlerts = [
    {
      patient_name: "Juan Nicolás",
      patient_id: 1,
      date: 1607576700857,
      id: "a5966b84-ca7f-4b6e-ab6a-cc1f13080243_vieja",
      name: "mecanica_ventilatoria",
      message: "Mecanica ventilatoria regular evaluar pase a UTI",
    },
  ];
  res.json(
    generatedAlerts.concat(unReadAlerts).sort((a, b) => a.date - b.date)
  );
};
export default getAlerts;
