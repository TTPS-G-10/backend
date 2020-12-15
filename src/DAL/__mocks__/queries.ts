import { RuleOperator, RuleType, KnownRulesKeys } from "../../model/Rule";

const getRules = async () => {
  return [
    {
      name: "somnolencia",
      operator: RuleOperator.EQUAL,
      description: "Somnolencia: evaluar pase a UTI",
      type: RuleType.BOOLEAN,
      active: true,
      key: KnownRulesKeys.SOM,
      id: 1,
    },
    {
      name: "mecanica_ventilatoria",
      operator: RuleOperator.IN,
      parameter: "regular,mala",
      description: "Mecanica ventilatoria :value evaluar pase a UTI",
      type: RuleType.VALUE_LIST,
      active: true,
      key: KnownRulesKeys.MEC_VEN,
      id: 2,
    },
    {
      name: "frecuencia_respiratoria",
      operator: RuleOperator.GREATER_THAN,
      parameter: 60,
      description:
        "Frecuencia respiratoria mayor a :value por minuto, evaluar pase a UTI",
      type: RuleType.NUMERIC,
      active: true,
      key: KnownRulesKeys.FRE_RESP,
      id: 3,
    },
    {
      name: "saturación_de_oxígeno",
      operator: RuleOperator.LESS_THAN,
      parameter: 92,
      description:
        "Saturacion de oxigeno menor a 92%. Evaluar oxigenoterapia y prono",
      type: RuleType.NUMERIC,
      active: true,
      key: KnownRulesKeys.O_SAT,
      id: 4,
    },
    {
      name: "saturación_de_oxígeno_2",
      operator: RuleOperator.GREATER_THAN_INCLUSIVE,
      parameter: 3,
      description:
        "Saturación de oxígeno bajó 3%. Evaluar oxigenoterapia y prono.	",
      type: RuleType.NUMERIC,
      active: true,
      id: 5,
      key: KnownRulesKeys.O_SAT_2,
      notRule: [KnownRulesKeys.O_SAT],
    },
  ];
};

const queries = {
  getRules,
};

export default queries;
