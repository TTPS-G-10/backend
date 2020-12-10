import { Engine, RuleProperties } from "json-rules-engine";
import queries from "../DAL/queries";
import { Rule as RawRule } from "../model/Rule";
import { buildRules } from "./rules";

let engine: Engine;
const init = async () => {
  const rawRules: RawRule[] = await queries.getRules();
  const engineRules: RuleProperties[] = buildRules(rawRules);
  engine = new Engine(engineRules, { allowUndefinedFacts: true });
};
const getEngine = () => engine;

const EngineRule = {
  init,
  getEngine,
};

export default EngineRule;
