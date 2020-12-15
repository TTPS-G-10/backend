import { Engine } from "json-rules-engine";
import { KnownRules } from "../model/Rule";
import EngineRule from "../rule-engine/engine";
//jest.enableAutomock();
jest.mock("../DAL/queries");

test("test Engine Initialization", async () => {
  await EngineRule.init();
  const rules = await EngineRule.getActiveRules();
  expect(rules).toBeDefined();
  expect(rules.length).toBeGreaterThanOrEqual(5);
});
