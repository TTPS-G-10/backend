import { Response, Request } from "express";
import { Alert } from "../model/Alert";
import queries from "../DAL/queries";
import { CustomRequest } from "../model/Request";
import { User } from "../model/User";

const getAlertsNotSee = async (req: Request, res: Response) => {
  const alerts: Alert[] = await queries.getAlertsnotSeeByUserId(
    (req as CustomRequest).user.id
  );
  console.log(alerts);

  res.json(alerts);
};

const getAlertsAndPatients = async (req: Request, res: Response) => {
  const user: User = (req as CustomRequest).user;
  console.log("ususario", user);

  const alerts = await queries.getAlertsAndPatientByUserId(user.id);
  console.log("LLega al controler de alerts/all", alerts);
  res.json({ alerts });
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
