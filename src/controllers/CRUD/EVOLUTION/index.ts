import { Request, Response } from "express";
import queries from "../../../DAL/queries";
import { Evolution } from "../../../model/Evolution";
import { CustomRequest } from "../../../model/Request";

const create = async (req: Request, res: Response) => {
  console.log("LO QUE ME LLEGA", req.body.evolution);
  const evolution = {
    ...req.body.evolution,
  };

  if (req.body.evolution.type === "maskWithReservoir") {
    evolution.maskWithReservoir = true;
    delete evolution.type;
  }

  if (req.body.evolution.type === "nasalOxygenCannula") {
    evolution.nasalOxygenCannula = true;
    delete evolution.type;
  }

  console.log(evolution);
  const patientId = req.body.patientId;
  const userId = (req as CustomRequest).user.id;
  const internament = await queries.findOpenInternmentWithPatientId(patientId);
  if (internament) {
    const systemChangeId = await queries.findSystemChangesOfInternmentWithInternmentId(
      internament.id
    );
    console.log("systemchangeid:", systemChangeId);
    if (systemChangeId) {
      const result = await queries.evolvePatient(
        patientId,
        userId,
        evolution,
        systemChangeId[0].id
      );
      if (!!result) res.sendStatus(201);
      if (!result) res.sendStatus(500);
    }
  }
};
const Evolution = {
  create,
};
export default Evolution;
