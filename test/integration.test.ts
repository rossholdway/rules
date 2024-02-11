import { expect } from "chai";
import { describe, it } from "std/testing/bdd.ts";

import {
  parse,
  isValid,
  // Rules
  any,
  array,
  bigInt,
  bool,
  enums,
  literal,
  num,
  obj,
  regex,
  str,
  tuple,
  // utils
  coerce,
  defaulted,
  // dynamic, TODO: Add dynamic to full object
  intersection,
  nullable,
  optional,
  refine,
  union
} from "../src/mod.ts";

describe("integration", function () {

  describe("Full object", function () {
    it("should return as valid", function () {
      const simpson = obj({
        firstName: str(),
        middleName: optional(str()),
        lastName: intersection([
          str(),
          literal("Simpson")
        ]),
        other: any(),
        episodes: array(obj({
          id: str(),
          name: str(),
          number: num({ min: 1, max: 728 }),
          season: num()
        })),
        ageInSeconds: bigInt(),
        alive: defaulted(bool(), (_ctx) => true),
        hairColour: enums(["Yellow", "Blue", "Bald", "Brown"] as const),
        age: coerce(num(), (value) => {
          if (typeof value === "string") {
            return parseInt(value, 10);
          } else {
            return value;
          }
        }),
        neighbour: regex(/.*Flanders$/i),
        children: nullable(
          tuple([literal("Bart"), literal("Lisa"), literal("Maggie")])
        ),
        email: refine("email", str(), (ctx) => {
          if (!/\S+@\S+\.\S+/.test(ctx.value)) {
            return ctx.error(
              "invalid_email",
              "Must be a valid email"
            )
          }
          return ctx.success();
        }),
        knownAs: union([
          obj({name: literal("Max Power")}),
          obj({name: literal("Mr. Plow")}),
          obj({name: literal("Mr. Sparkle")})
        ])
      });

      const homer = {
        firstName: "Homer",
        lastName: "Simpson",
        other: { favColour: "Yellow" },
        episodes: [{
          id: "3F14",
          name: "Homer the Smithers",
          number: 145,
          season: 7
        }],
        ageInSeconds: 1229904000n,
        hairColour: "Bald",
        age: "39",
        neighbour: "Ned Flanders",
        children: ["Bart", "Lisa", "Maggie"],
        email: "chunkylover53@aol.com",
        knownAs: { name: "Mr. Plow" }
      }

      const result = parse(simpson, homer);

      expect(isValid(result)).to.be.true;
      expect(result[1]!).to.eql(  {
        firstName: "Homer",
        lastName: "Simpson",
        other: { favColour: "Yellow" },
        episodes: [ { id: "3F14", name: "Homer the Smithers", number: 145, season: 7 } ],
        ageInSeconds: 1229904000n,
        alive: true,
        hairColour: "Bald",
        age: 39,
        neighbour: "Ned Flanders",
        children: [ "Bart", "Lisa", "Maggie" ],
        email: "chunkylover53@aol.com",
        knownAs: { name: "Mr. Plow" }
      });
    });
  });
});
