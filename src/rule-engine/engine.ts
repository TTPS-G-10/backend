import { Engine, RuleProperties } from "json-rules-engine";
import queries from "../DAL/queries";
import { Rule as RawRule } from "../model/Rule";
import { buildRules } from "./rules";

const getActiveRules = async () =>
  (await queries.getRules()).filter((rule) => rule.active);

const init = async () => {
  const engineRules: RuleProperties[] = buildRules(await getActiveRules());
  const engine: Engine = new Engine(engineRules, { allowUndefinedFacts: true });
  return engine;
};

const EngineRule = {
  init,
  getActiveRules,
};

export default EngineRule;
