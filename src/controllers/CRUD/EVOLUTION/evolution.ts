import { Request, Response } from "express";
import queries from "../../../DAL/queries";
import { CustomRequest } from "../../../model/Request";
import genNewAlerts from "../../../services/genNewAlerts";
import EngineRule from "../../../rule-engine/engine";
import { Evolution } from "../../../model/Evolution";
import { KnownRules, KnownRulesKeys } from "../../../model/Rule";
import { User } from "../../../model/User";

const getFactFromEvolution = (
  factName: KnownRules,
  evolution: Evolution,
  previousEvolution?: Evolution
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
    case KnownRules.O_SAT_2:
      if (
        previousEvolution &&
        previousEvolution.oxygenSaturation &&
        evolution.oxygenSaturation
      ) {
        return previousEvolution.oxygenSaturation - evolution.oxygenSaturation;
      }
    default:
      return;
  }
};

const create = async (req: Request, res: Response) => {
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

  const patientId = req.body.patientId;
  const userId = (req as CustomRequest).user.id;
  const previousEvolution: Evolution | null = await queries.getPreviousEvolution(
    patientId
  );
  const internament = await queries.findOpenInternmentWithPatientId(patientId);
  if (!internament) {
    console.log("no se encontro la internacion");
    return res.sendStatus(404);
  }
  const systemChange = await queries.findSystemChangesOfInternmentWithInternmentId(
    internament.id
  );
  if (!systemChange) {
    console.log("no se encontro el cambio de sistema");
    return res.sendStatus(404);
  }

  const systemChangeId: number = systemChange[0].id;
  const internmentId: number = systemChange[0].internmentId;
  console.log("evolution", evolution);
  console.log("systemChangeId", systemChangeId);
  console.log("userId", userId);
  console.log("patientId", patientId);

  const evaluationID = await queries.evolvePatient(
    evolution,
    systemChangeId,
    userId,
    patientId,
    new Date()
  );

  if (!!evaluationID) res.sendStatus(201);
  if (!evaluationID) res.sendStatus(500);
  // Effect => rules evaluations and alerts ---
  const rules = await EngineRule.getActiveRules();
  const facts = rules.reduce((acc, current) => {
    return {
      ...acc,
      [current.name]: getFactFromEvolution(
        current.name as KnownRules,
        evolution,
        previousEvolution ?? undefined
      ),
    };
  }, {});

  const usersAsigneds = await queries.returnDoctorsIdAssinedToInternmentById(
    internmentId
  );

  return usersAsigneds.map(async (user: User) => {
    const firstRun = await genNewAlerts({
      evaluationId: evaluationID,
      userId: user.id,
      facts: { ...facts },
    });

    const newAlerts = firstRun.filter((alert) => {
      const found = firstRun.find(
        (alert) => alert.ruleKey === KnownRulesKeys.O_SAT
      );
      if (found) {
        return alert.ruleKey !== KnownRulesKeys.O_SAT_2;
      }
      return true;
    });

    queries.saveAlerts(newAlerts);
    //------------
  });
};
const Evolution = {
  create,
};
export default Evolution;
