import {
  RuleProperties,
  Event,
  TopLevelCondition,
  NestedCondition,
} from "json-rules-engine";
import { InternmentStatuses } from "../model/Internment";

export enum SYSTEM_CHANGE_RULE {
  SUCCESS = "system_change_event_success",
}

const system_change_event: Event = {
  type: SYSTEM_CHANGE_RULE.SUCCESS,
};

const conditions: NestedCondition[] = [
  // Changes From System GUARDIA
  {
    fact: InternmentStatuses.GUARDIA,
    operator: "in",
    // sistemas a los que puede cambiarse
    value: [
      InternmentStatuses.UTI,
      InternmentStatuses.PISO_COVID,
      InternmentStatuses.OBITO,
    ],
  },
  // Changes From System COVID
  {
    fact: InternmentStatuses.PISO_COVID,
    operator: "in",
    // sistemas a los que puede cambiarse
    value: [
      InternmentStatuses.UTI,
      InternmentStatuses.PISO_COVID,
      InternmentStatuses.OBITO,
      InternmentStatuses.HOTEL,
      InternmentStatuses.DOMICILIO,
    ],
  },
];

const system_change_conditions: TopLevelCondition = {
  all: [],
  any: conditions,
};

const system_change_rule: RuleProperties = {
  conditions: system_change_conditions,
  event: system_change_event,
  name: "system_change_rule",
};

export default system_change_rule;
