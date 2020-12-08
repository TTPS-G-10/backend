import { validationResult } from "express-validator";
import queries from "../../../DAL/queries";
import { Request, Response } from "express";
import { User } from "../../../model/User";
import { CustomRequest } from "../../../model/Request";

const doctorsOfSystemToSystemchief = async (req: Request, res: Response) => {
  console.log("llega", req.body);
  const user: User = (req as CustomRequest).user;
  if (user) {
    const systemId: number = parseInt(req.query.systemId as string, 10);
    const errors = validationResult(req);
    console.log(systemId);
    if (!errors.isEmpty()) {
      console.log("entro a los errores", errors);
      return res.sendStatus(400);
    }
    try {
      const doctors = await queries.returnDoctorsOfSystemForId(systemId);
      if (!doctors) {
        console.log("the doctors was not found");
        return res.sendStatus(404);
      }
      console.log(doctors);

      res.json({ doctors });
    } catch (error) {
      console.log("patient not found");
      return res.sendStatus(500);
    }
  } else {
    res.sendStatus(404);
  }
};
export default doctorsOfSystemToSystemchief;