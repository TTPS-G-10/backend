import EngineRule from "../rule-engine/engine";
import { Event } from "json-rules-engine";
import { v4 as uuidv4 } from "uuid";
const genNewAlerts = async (
  patientsEvaluationFacts: {
    patient_name: string;
    patient_id: number;
    facts: { [key: string]: any };
  }[]
) => {
  const engine = EngineRule.getEngine();
  const result = await Promise.all(
    patientsEvaluationFacts.map(async (evaluation) => {
      return engine.run(evaluation.facts).then((results) => {
        return results.events.map((event: Event) => {
          return {
            patient_name: evaluation.patient_name,
            patient_id: evaluation.patient_id,
            date: Date.now(),
            id: uuidv4(),
            name: event.type,
            message: (event?.params?.message as string).replace(
              ":value",
              evaluation.facts[event?.params?.name as string]
            ),
          };
        });
      });
    })
  );
  return result.flat();
};
export default genNewAlerts;
