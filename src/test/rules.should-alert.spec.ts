import { Engine } from "json-rules-engine";
import { KnownRules } from "../model/Rule";
import EngineRule from "../rule-engine/engine";
//jest.enableAutomock();
jest.mock("../DAL/queries");

describe("All Rules Must be Valid to generate Alerts here", () => {
  const enginePromise = EngineRule.init();

  it(`should test Rule ${[KnownRules.SOM]} and return as success`, async () => {
    const fact = {
      [KnownRules.SOM]: true,
    };
    enginePromise.then((engine) =>
      engine
        .run(fact)
        .then((result) =>
          expect(
            result.events.find((event) => event.type === KnownRules.SOM)
          ).toBeDefined()
        )
    );
  });

  it(`should test Rule ${[
    KnownRules.FRE_RESP,
  ]} and return as success`, async () => {
    const fact = {
      [KnownRules.FRE_RESP]: 100,
    };
    enginePromise.then((engine) =>
      engine
        .run(fact)
        .then((result) =>
          expect(
            result.events.find((event) => event.type === KnownRules.FRE_RESP)
          ).toBeDefined()
        )
    );
  });
  it(`should test Rule ${[
    KnownRules.MEC_VEN,
  ]} and return as success`, async () => {
    const fact = {
      [KnownRules.MEC_VEN]: "regular",
    };
    enginePromise.then((engine) =>
      engine
        .run(fact)
        .then((result) =>
          expect(
            result.events.find((event) => event.type === KnownRules.MEC_VEN)
          ).toBeDefined()
        )
    );
  });
  it(`should test Rule ${[
    KnownRules.O_SAT,
  ]} and return as success`, async () => {
    const fact = {
      [KnownRules.O_SAT]: 10,
    };
    enginePromise.then((engine) =>
      engine
        .run(fact)
        .then((result) =>
          expect(
            result.events.find((event) => event.type === KnownRules.O_SAT)
          ).toBeDefined()
        )
    );
  });
  it(`should test Rule ${[
    KnownRules.O_SAT_2,
  ]} and return as success`, async () => {
    const fact = {
      [KnownRules.O_SAT_2]: 4,
    };
    enginePromise.then((engine) =>
      engine
        .run(fact)
        .then((result) =>
          expect(
            result.events.find((event) => event.type === KnownRules.O_SAT_2)
          ).toBeDefined()
        )
    );
  });
  it(`should test Rule ${[
    KnownRules.SYMP,
  ]} and return as success`, async () => {
    const fact = {
      [KnownRules.SYMP]: true,
    };
    enginePromise.then((engine) =>
      engine
        .run(fact)
        .then((result) =>
          expect(
            result.events.find((event) => event.type === KnownRules.SYMP)
          ).toBeDefined()
        )
    );
  });
});
