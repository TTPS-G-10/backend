import { Engine } from "json-rules-engine";
import system_change_rule from "./systemChangesRule";

let engine: Engine;
const init = () => {
  engine = new Engine([system_change_rule], { allowUndefinedFacts: true });
};
const getEngine = () => engine;

const EngineRule = {
  init,
  getEngine,
};

export default EngineRule;
