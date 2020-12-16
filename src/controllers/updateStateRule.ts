import { Request, Response } from "express";
import { User } from "../model/User";
import queries from "../DAL/queries";
import { CustomRequest } from "../model/Request";
import { validationResult } from "express-validator";

const updateStateRule = async (req: Request, res: Response) => {
  const user: User = (req as CustomRequest).user;
  if (user) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.sendStatus(400);
    }
    try {
      const result = await queries.updateStateRule(
        req.body.ruleId,
        req.body.value
      );
    } catch (err) {
      console.error(err);
      res.sendStatus(500);
    }
  } else {
    res.sendStatus(404);
  }
};
export default updateStateRule;
