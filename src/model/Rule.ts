export enum KnownRules {
  SOM = "somnolencia",
  MEC_VEN = "mecanica_ventilatoria",
  FRE_RESP = "frecuencia_respiratoria",
  O_SAT = "saturación_de_oxígeno",
  O_SAT_2 = "saturación_de_oxígeno_2",
}

export enum KnownRulesKeys {
  SOM = "SOM",
  MEC_VEN = "MEC_VEN",
  FRE_RESP = "FRE_RESP",
  O_SAT = "O_SAT",
  O_SAT_2 = "O_SAT_2",
}

export type Rule = {
  name: KnownRules | string;
  parameter?: string | number;
  description: string;
  operator: RuleOperator;
  active: boolean;
  type: RuleType;
  id: number;
  notRule?: string;
  key: KnownRulesKeys;
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
