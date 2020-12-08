import { Request, Response } from "express";
import queries from "../../../DAL/queries";
import { validationResult } from "express-validator";
import { CustomRequest } from "../../../model/Request";

const create = async (req: Request, res: Response) => {
  const evolution = {
    ...req.body.evolution,
  };
  const patientId = req.body.patientId;
  const userId = (req as CustomRequest).user.id;
  const result = await queries.evolvePatient(patientId, userId, evolution);
  if (!!result) res.sendStatus(201);
  if (!result) res.sendStatus(500);
};
const Evolution = {
  create,
};
export default Evolution;
