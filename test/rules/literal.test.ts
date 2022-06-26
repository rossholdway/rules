import { expect } from "https://cdn.skypack.dev/chai@4.3.4?dts";
import { describe, it } from "https://deno.land/std@0.145.0/testing/bdd.ts";

import { ctx } from "../utils.ts";
import type { Invalid } from "./../../src/mod.ts";
import { literal } from "../../src/rules/literal.ts";

describe("literal", function () {
  const invalidInput = [
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
    it("should allow literal type string", function () {
      const rule = literal("Homer");
      expect(rule([], "Homer", ctx).success).to.be.true;
    });

    it("should allow literal type number", function () {
      const rule = literal(42);
      expect(rule([], 42, ctx).success).to.be.true;
    });

    it("should allow literal type boolean", function () {
      const rule = literal(true);
      expect(rule([], true, ctx).success).to.be.true;
    });

    it("should allow literal type null", function () {
      const rule = literal(null);
      expect(rule([], null, ctx).success).to.be.true;
    });

    it("should allow literal type undefined", function () {
      const rule = literal(undefined);
      expect(rule([], undefined, ctx).success).to.be.true;
    });
  });

  describe("invalid", function () {
    it("should disallow undefined when undefined is not constant", function () {
      const rule = literal("Homer");
      const result = rule([], undefined, ctx) as Invalid;

      expect(result.success).to.be.false;
      expect(result.errors[0].code).to.eq("required");
    });

    it("should disallow invalid input", function () {
      const rule = literal("Homer");
      invalidInput.forEach((type) => {
        const result = rule([], type, ctx) as Invalid;

        expect(result.success).to.be.false;
        expect(result.errors[0].code).to.eq("invalid_literal");
      });
    });
  });
});
