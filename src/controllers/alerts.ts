import { Response, Request } from "express";
import EngineRule from "../rule-engine/engine";
import { EngineResult, Event } from "json-rules-engine";
import { type } from "os";

const getAlerts = async (req: Request, res: Response) => {
  const engine = EngineRule.getEngine();
  const facts: { [key: string]: any } = {
    somnolencia: true,
    mecanica_ventilatoria: "regular",
    frecuencia_respiratoria: 61,
    saturación_de_oxígeno: 90,
  };
  const result: EngineResult = await engine.run(facts);
  res.json(
    result.events.map((event: Event) => {
      return {
        name: event.type,
        message: (event?.params?.message as string).replace(
          ":value",
          facts[event?.params?.name as string]
        ),
      };
    })
  );
};
export default getAlerts;
