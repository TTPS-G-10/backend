import { Response, Request } from "express";
import EngineRule from "../rule-engine/engine";
import { EngineResult, Event } from "json-rules-engine";
import genNewAlerts from "../services/genNewAlerts";
import { Alert } from "../model/Alert";
import queries from "../DAL/queries";
import { CustomRequest } from "../model/Request";

const getAlerts = async (req: Request, res: Response) => {
  const alerts: Alert[] = await queries.getAlertsByUserId(
    (req as CustomRequest).user.id
  );
  res.json(alerts);
};
export default getAlerts;
