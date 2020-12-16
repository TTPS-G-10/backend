import { Engine } from "json-rules-engine";
import { KnownRules } from "../model/Rule";
import EngineRule from "../rule-engine/engine";
//jest.enableAutomock();
jest.mock("../DAL/queries");

test(`test Rule ${[KnownRules.SOM]} con valor false`, async () => {
  const engine = await EngineRule.init();
  const fact = {
    [KnownRules.SOM]: false,
  };
  const result = await engine.run(fact);
  expect(
    result.events.find((event) => event.type === KnownRules.SOM)
  ).toBeUndefined();
});

test(`test Rule ${[KnownRules.FRE_RESP]}`, async () => {
  const engine = await EngineRule.init();
  const fact = {
    [KnownRules.FRE_RESP]: 60,
  };
  const result = await engine.run(fact);
  expect(
    result.events.find((event) => event.type === KnownRules.FRE_RESP)
  ).toBeUndefined();
});
test(`test Rule ${[KnownRules.MEC_VEN]}`, async () => {
  const engine = await EngineRule.init();
  const fact = {
    [KnownRules.MEC_VEN]: "buenas",
  };
  const result = await engine.run(fact);
  expect(
    result.events.find((event) => event.type === KnownRules.MEC_VEN)
  ).toBeUndefined();
});
test(`test Rule ${[KnownRules.O_SAT]}`, async () => {
  const engine = await EngineRule.init();
  const fact = {
    [KnownRules.O_SAT]: 93,
  };
  const result = await engine.run(fact);
  expect(
    result.events.find((event) => event.type === KnownRules.O_SAT)
  ).toBeUndefined();
});

test(`test Rule ${[KnownRules.O_SAT_2]}`, async () => {
  const engine = await EngineRule.init();
  const fact = {
    [KnownRules.O_SAT_2]: 2,
  };
  const result = await engine.run(fact);
  expect(
    result.events.find((event) => event.type === KnownRules.O_SAT_2)
  ).toBeUndefined();
});

test(`test Rule ${[KnownRules.SYMP]}`, async () => {
  const engine = await EngineRule.init();
  const fact = {
    [KnownRules.SYMP]: false,
  };
  const result = await engine.run(fact);
  expect(
    result.events.find((event) => event.type === KnownRules.SYMP)
  ).toBeUndefined();
});
