import { Request, Response } from "express";
import queries from "../../../DAL/queries";
import { validationResult } from "express-validator";
import { CustomRequest } from "../../../model/Request";
import genNewAlerts from "../../../services/genNewAlerts";
import EngineRule from "../../../rule-engine/engine";
import { Evolution } from "../../../model/Evolution";
import { KnownRules } from "../../../model/Rule";

const getFactFromEvolution = (
  factName: KnownRules,
  evolution: Evolution
): any | undefined => {
  switch (factName) {
    case KnownRules.SOM:
      if (evolution.drowsiness) {
        return true;
      }
    case KnownRules.FRE_RESP:
      if (evolution.breathingFrequency) {
        return evolution.breathingFrequency;
      }
    case KnownRules.MEC_VEN:
      if (evolution.ventilatoryMechanics) {
        return evolution.ventilatoryMechanics;
      }
    case KnownRules.O_SAT:
      if (evolution.oxygenSaturation) {
        return evolution.oxygenSaturation;
      }
    default:
      return;
  }
};

const create = async (req: Request, res: Response) => {
  const evolution: Evolution = {
    ...req.body.evolution,
  };
  const patientId = req.body.patientId;
  const userId = (req as CustomRequest).user.id;
  const evaluationID = await queries.evolvePatient(
    patientId,
    userId,
    evolution
  );
  console.log("evaluation ID is: ", evaluationID);
  if (!!evaluationID) res.sendStatus(201);
  if (!evaluationID) res.sendStatus(500);
  // Effect => rules evaluations and alerts ---
  const rules = EngineRule.getActiveRules();
  const facts = rules.reduce((acc, current) => {
    return {
      ...acc,
      [current.name]: getFactFromEvolution(
        current.name as KnownRules,
        evolution
      ),
    };
  }, {});
  const generetedAlerts = await genNewAlerts({
    userId,
    evaluationId: patientId,
    facts: { ...facts },
  });
  queries.saveAlerts(generetedAlerts);
  console.log("active rules => ", rules);
  console.log("facts => ", facts);
  console.log("generetedAlerts => ", generetedAlerts);
  //------------
};
const Evolution = {
  create,
};
export default Evolution;
