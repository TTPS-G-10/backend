import { Response, Request } from "express";
import { Alert } from "../model/Alert";
import queries from "../DAL/queries";
import { CustomRequest } from "../model/Request";

const getAlerts = async (req: Request, res: Response) => {
  const alerts: Alert[] = await queries.getAlertsByUserId(
    (req as CustomRequest).user.id
  );
  res.json(alerts);
};

const setAlertAsSeen = async (req: Request, res: Response) => {
  try {
    const alertID = req.body.id;
    await queries.setAlertAsSeen(alertID);
    res.sendStatus(201);
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
};
const Alerts = {
  getAlerts,
  setAlertAsSeen,
};
export default Alerts;
