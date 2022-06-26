import { expect } from "https://cdn.skypack.dev/chai@4.3.4?dts";
import { describe, it } from "https://deno.land/std@0.145.0/testing/bdd.ts";

import { any } from "../../src/rules/any.ts";
import { ctx } from "../utils.ts";

describe("any", function () {
  const rule = any();

  const inputs = [
    null,
    {},
    [],
    "string",
    1,
    0,
    true,
    false,
    Symbol("test"),
    BigInt(Number.MAX_SAFE_INTEGER),
    () => {
      return "noop";
    },
    new Set(),
    new Map(),
  ];

  describe("valid", function () {
    it("should allow all inputs", function () {
      inputs.forEach((type) => {
        const result = rule([], type, ctx);
        expect(result.success).to.be.true;
      });
    });
  });
});
