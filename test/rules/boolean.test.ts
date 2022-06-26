import { expect } from "https://cdn.skypack.dev/chai@4.3.4?dts";
import { describe, it } from "https://deno.land/std@0.145.0/testing/bdd.ts";

import { ctx } from "../utils.ts";
import type { Invalid } from "./../../src/mod.ts";
import { bool } from "../../src/rules/boolean.ts";

describe("boolean", function () {
  const rule = bool();

  const invalidInput = [
    null,
    {},
    [],
    "string",
    1,
    0,
    // true,
    // false,
    Symbol("test"),
    BigInt(Number.MAX_SAFE_INTEGER),
    () => {
      return "noop";
    },
    new Set(),
    new Map(),
  ];

  describe("valid", function () {
    it("should allow type of boolean", function () {
      expect(rule([], true, ctx).success).to.be.true;
      expect(rule([], false, ctx).success).to.be.true;
    });
  });

  describe("invalid", function () {
    it("should disallow undefined", function () {
      const result = rule([], undefined, ctx) as Invalid;

      expect(result.success).to.be.false;
      expect(result.errors[0].code).to.eq("required");
    });

    it("should disallow invalid input type", function () {
      invalidInput.forEach((type) => {
        const result = rule([], type, ctx) as Invalid;

        expect(result.success).to.be.false;
        expect(result.errors[0].code).to.eq("invalid_type");
      });
    });
  });
});
