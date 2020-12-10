export type Rule = {
  name: string;
  parameter?: string | number;
  description: string;
  operator: RuleOperator;
  active: boolean;
  type: RuleType;
};

export enum RuleType {
  BOOLEAN = "BOOLEAN",
  VALUE_LIST = "VALUE_LIST",
  NUMERIC = "NUMERIC",
}

export enum RuleOperator {
  // NUMERIC operators:
  LESS_THAN = "lessThan",
  LESS_THAN_INCLUSIVE = "lessThanInclusive",
  GREATER_THAN = "greaterThan",
  GREATER_THAN_INCLUSIVE = "greaterThanInclusive",
  // Array operators:
  IN = "in",
  NOT_IN = "notIn",
  CONTAINS = "contains",
  DOES_NOT_CONTAIN = "doesNotContain",
  // String and Numeric operators:
  EQUAL = "equal",
  NOT_EQUAL = "notEqual",
  THESE = "these",
}
