import { Request, Response } from "express";
import queries from "../../../DAL/queries";
import { CustomRequest } from "../../../model/Request";
import genNewAlerts from "../../../services/genNewAlerts";
import EngineRule from "../../../rule-engine/engine";
import { Evolution } from "../../../model/Evolution";
import { KnownRules, KnownRulesKeys } from "../../../model/Rule";

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
  const evolution: Evolution = {
    ...req.body.evolution,
  };
  const patientId = req.body.patientId;
  const userId = (req as CustomRequest).user.id;
  const previousEvolution: Evolution | null = await queries.getPreviousEvolution(
    patientId
  );
  const evaluationID = await queries.evolvePatient(
    evolution,
    5, // HARDCODED SystemChange ID
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
  const firstRun = await genNewAlerts({
    userId,
    evaluationId: patientId,
    facts: { ...facts },
  });
  /*   const secondFacts = {
    ...firstRun.reduce((acc, current) => {
      return {
        ...acc,
        [current.ruleKey]: current.ruleKey,
      };
    }, {}),
  };
  const secondRun = await genNewAlerts({
    userId,
    evaluationId: patientId,
    facts: { ...secondFacts },
  }); */

  // prevenimos que la alerta 6 se guarde si es que saltó la 5
  // Lo hacemos manualmente porque no pude hacer andar el motor con esta condición
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

  console.log("active rules => ", rules);
  console.log("facts => ", facts);
  console.log("firstRun => ", firstRun);
  console.log("generetedAlerts => ", newAlerts);
  //console.log("second run => ", secondRun);
  //console.log("second facts => ", secondFacts);
  console.log("evolution => ", evolution);
  console.log("previousEvolution => ", previousEvolution);
  //------------
};
const Evolution = {
  create,
};
export default Evolution;
