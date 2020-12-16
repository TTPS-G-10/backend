import { Request, Response } from "express";
import queries from "../DAL/queries";

const rules = async (req: Request, res: Response) => {
  try {
    const rulesData = await queries.getAllRules();
    if (!rulesData) {
      res.sendStatus(404);
    }
    res.json(rulesData);
  } catch (err) {
    console.error(err);
    res.status(500);
  }
};
export default rules;
