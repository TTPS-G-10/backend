import { Engine } from "json-rules-engine";
import { KnownRules } from "../model/Rule";
import EngineRule from "../rule-engine/engine";
//jest.enableAutomock();
jest.mock("../DAL/queries");

test(`test Rule ${[KnownRules.SOM]} con valor true`, async () => {
  const engine = await EngineRule.init();
  const fact = {
    [KnownRules.SOM]: true,
  };
  const result = await engine.run(fact);
  expect(
    result.events.find((event) => event.type === KnownRules.SOM)
  ).toBeDefined();
});

test(`test Rule ${[KnownRules.FRE_RESP]}`, async () => {
  const engine = await EngineRule.init();
  const fact = {
    [KnownRules.FRE_RESP]: 100,
  };
  const result = await engine.run(fact);
  expect(
    result.events.find((event) => event.type === KnownRules.FRE_RESP)
  ).toBeDefined();
});
test(`test Rule ${[KnownRules.MEC_VEN]}`, async () => {
  const engine = await EngineRule.init();
  const fact = {
    [KnownRules.MEC_VEN]: "regular",
  };
  const result = await engine.run(fact);
  expect(
    result.events.find((event) => event.type === KnownRules.MEC_VEN)
  ).toBeDefined();
});
test(`test Rule ${[KnownRules.O_SAT]}`, async () => {
  const engine = await EngineRule.init();
  const fact = {
    [KnownRules.O_SAT]: 10,
  };
  const result = await engine.run(fact);
  expect(
    result.events.find((event) => event.type === KnownRules.O_SAT)
  ).toBeDefined();
});

test(`test Rule ${[KnownRules.O_SAT_2]}`, async () => {
  const engine = await EngineRule.init();
  const fact = {
    [KnownRules.O_SAT_2]: 4,
  };
  const result = await engine.run(fact);
  expect(
    result.events.find((event) => event.type === KnownRules.O_SAT_2)
  ).toBeDefined();
});
