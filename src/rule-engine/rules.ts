import {
  RuleProperties,
  TopLevelCondition,
  NestedCondition,
  Event,
  Operator,
} from "json-rules-engine";
import {
  KnownRules,
  Rule as RawRule,
  RuleOperator,
  RuleType,
} from "../model/Rule";

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

const buildConditions = (rule: RawRule): NestedCondition[] => {
  if (!rule.notRule) {
    return [
      {
        fact: rule.name,
        operator: rule.operator,
        value: buildValue(rule.type, rule.parameter),
      },
    ];
  } else {
    const multipleConditions = [
      {
        fact: rule.name,
        operator: rule.operator,
        value: buildValue(rule.type, rule.parameter),
      },
    ].concat(
      rule.notRule.map((rule) => {
        return {
          fact: rule,
          operator: RuleOperator.NOT_EQUAL,
          value: rule,
        };
      })
    );
    // console.log("multiple conditions => ", multipleConditions);
    return multipleConditions;
  }
};

export const buildRules = (rawRules: RawRule[]): RuleProperties[] =>
  rawRules.map((rawRule) => {
    const event: Event = {
      type: rawRule.name,
      params: {
        message: rawRule.description,
        name: rawRule.name,
        key: rawRule.key,
      },
    };
    const conditions: NestedCondition[] = buildConditions(rawRule);
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
