import { expect } from "https://cdn.skypack.dev/chai@4.3.4?dts";
import { describe, it } from "https://deno.land/std@0.145.0/testing/bdd.ts";

import { ctx, invalidRule, validRule } from "../utils.ts";
import type { Invalid } from "./../../src/mod.ts";
import { array } from "../../src/rules/array.ts";

describe("array", function () {
  const invalidInput = [
    null,
    {},
    // [],
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
    it("should allow valid array", function () {
      const rule = array(validRule);
      expect(rule([], ["Homer"], ctx).success).to.be.true;
    });

    it("should support nested arrays", function () {
      const rule = array(array(validRule));
      const result = rule([], [["Flanders"]], ctx);

      expect(result.success).to.be.true;
    });
  });

  describe("invalid", function () {
    it("should disallow undefined", function () {
      const rule = array(validRule);
      const result = rule([], undefined, ctx) as Invalid;

      expect(result.success).to.be.false;
      expect(result.errors[0].code).to.eq("required");
    });

    it("should fail and passthrough errors", function () {
      const rule = array(invalidRule);
      const result = rule([], ["invalid_value"], ctx) as Invalid;

      expect(result.success).to.be.false;
      expect(result.errors[0].code).to.eq("error_code");
    });

    it("should disallow invalid input type", function () {
      const rule = array(validRule);
      invalidInput.forEach((type) => {
        const result = rule([], type, ctx) as Invalid;

        expect(result.success).to.be.false;
        expect(result.errors[0].code).to.eq("invalid_type");
      });
    });

    describe("path", function () {
      it("should be correct", function () {
        const rule = array(invalidRule);
        const result = rule([], ["Homer"], ctx) as Invalid;

        expect(result.errors[0].path).to.eql(["0"]);
      });
      it("should be correct when nested", function () {
        const rule = array(array(invalidRule));
        const result = rule([], [["Ned"]], ctx) as Invalid;

        expect(result.errors[0].path).to.eql(["0", "0"]);
      });
    });

    describe("options", function () {
      it("should disallow input less than min length", function () {
        const rule = array(validRule, { min: 2 });
        const result = rule([], ["Homer"], ctx) as Invalid;

        expect(result.success).to.be.false;
        expect(result.errors[0].code).to.eq("invalid_min_length");
      });

      it("should disallow input greater than max length", function () {
        const rule = array(validRule, { max: 2 });
        const result = rule(
          [],
          ["Homer", "Lisa", "Hank Scorpio"],
          ctx,
        ) as Invalid;

        expect(result.success).to.be.false;
        expect(result.errors[0].code).to.eq("invalid_max_length");
      });
    });
  });
});
