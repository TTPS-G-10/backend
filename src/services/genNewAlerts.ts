import EngineRule from "../rule-engine/engine";
import { Event } from "json-rules-engine";
import { Alert } from "../model/Alert";
interface genNewAlertsInput {
  evaluationId: number;
  userId: number;
  facts: { [key: string]: any };
}
const genNewAlerts = async ({
  userId,
  evaluationId,
  facts,
}: genNewAlertsInput): Promise<Alert[]> => {
  const engine = EngineRule.getEngine();
  return engine.run(facts).then((results) => {
    return results.events.map((event: Event) => {
      return {
        ruleName: event?.params?.name as string,
        evaluationId,
        userId,
        date: new Date(),
        name: event.type,
        readByUser: false,
        message: (event?.params?.message as string).replace(
          ":value",
          facts[event?.params?.name as string]
        ),
      };
    });
  });
};
export default genNewAlerts;
