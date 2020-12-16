import { validationResult } from "express-validator";
import queries from "../DAL/queries";
import { Request, Response } from "express";

import { User } from "../model/User";
import { CustomRequest } from "../model/Request";
import { Patient } from "../model/Patient";
import { Evolution } from "../model/Evolution";

const infoEvolution = async (req: Request, res: Response) => {
  const user: User = (req as CustomRequest).user;
  if (user) {
    const idString = req.query.id as string;
    const id: number = parseInt(idString, 10);
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.sendStatus(400);
    }
    try {
      const evolution:
        | Evolution
        | null
        | undefined = await queries.findEvolutionByID(id);
      if (!evolution) {
        console.log("the evolution was not found");
        return res.sendStatus(404);
      }
      console.log("evolucion data:", evolution);
      const patient: Patient | null | undefined = await queries.findPatientByID(
        evolution.patientId
      );
      const system:
        | String
        | null
        | undefined = await queries.findSystemForEvolution(
        evolution.systemChangeId
      );
      console.log("patien data:", patient);
      const lastName = patient?.lastName;
      const name = patient?.name;
      return res.json({ evolution, lastName, name, system });
    } catch (error) {
      console.log("evolution id invalid");
      return res.sendStatus(500);
    }
  } else {
    res.sendStatus(404);
  }
};
export default infoEvolution;
