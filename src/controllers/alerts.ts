import { Response, Request } from "express";
import { Alert } from "../model/Alert";
import queries from "../DAL/queries";
import { CustomRequest } from "../model/Request";

const getAlertsNotSee = async (req: Request, res: Response) => {
  const alerts: Alert[] = await queries.getAlertsnotSeeByUserId(
    (req as CustomRequest).user.id
  );
  res.json(alerts);
};

const getAlertsAndPatients = async (req: Request, res: Response) => {
  const alerts: Alert[] = await queries.getAlertsAndPatientByUserId(
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
  getAlertsAndPatients,
  getAlertsNotSee,
  setAlertAsSeen,
};
export default Alerts;
