import { Engine, RuleProperties } from "json-rules-engine";
import queries from "../DAL/queries";
import { Rule as RawRule } from "../model/Rule";
import { buildRules } from "./rules";

let engine: Engine;
let activeRules: RawRule[] = [];
const init = async () => {
  const rawRules: RawRule[] = await queries.getRules();
  activeRules = rawRules.filter((rule) => rule.active);
  const engineRules: RuleProperties[] = buildRules(rawRules);
  engine = new Engine(engineRules, { allowUndefinedFacts: true });
};
const getEngine = () => engine;
const getActiveRules = () => activeRules;

const EngineRule = {
  init,
  getEngine,
  getActiveRules,
};

export default EngineRule;
