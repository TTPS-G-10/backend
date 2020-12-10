import {
  RuleProperties,
  TopLevelCondition,
  NestedCondition,
  Event,
} from "json-rules-engine";
import { Rule as RawRule, RuleType } from "../model/Rule";

const buildValue = (
  type: RuleType,
  parameter: string | number | undefined
): string | string[] | boolean | number => {
  switch (type) {
    case RuleType.BOOLEAN:
      return true;
    case RuleType.NUMERIC:
      return parameter as number;
    case RuleType.VALUE_LIST:
      return (parameter as string).split(",");
    default:
      return parameter as string;
  }
};

const buildCondition = (rule: RawRule): NestedCondition => {
  return {
    fact: rule.name,
    operator: rule.operator,
    value: buildValue(rule.type, rule.parameter),
  };
};

export const buildRules = (rawRules: RawRule[]): RuleProperties[] =>
  rawRules.map((rawRule) => {
    const event: Event = {
      type: `${rawRule.name}_success`,
    };
    const conditions: NestedCondition[] = [buildCondition(rawRule)];
    const topLevelCondition: TopLevelCondition = {
      all: conditions,
    };
    const rule: RuleProperties = {
      conditions: topLevelCondition,
      event,
      name: rawRule.name,
    };
    return rule;
  });
