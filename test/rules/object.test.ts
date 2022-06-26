import { expect } from "https://cdn.skypack.dev/chai@4.3.4?dts";
import { describe, it } from "https://deno.land/std@0.145.0/testing/bdd.ts";

import { ctx, invalidRule, validRule } from "../utils.ts";
import type { Invalid } from "./../../src/mod.ts";
import { obj } from "../../src/rules/object.ts";
import { str } from "../../src/rules/string.ts";

describe("object", function () {
  const invalidInput = [
    null,
    // {},
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
    it("should allow valid object", function () {
      const rule = obj({ test: validRule });
      expect(rule([], { test: "Bart" }, ctx).success).to.be.true;
    });

    it("should support nested objects", function () {
      const rule = obj({ one: obj({ two: str() }) });
      const result = rule([], { one: { two: "Bart" } }, ctx);

      expect(result.success).to.be.true;
    });
  });

  describe("invalid", function () {
    it("should disallow undefined", function () {
      const rule = obj({ test: validRule });
      const result = rule([], undefined, ctx) as Invalid;

      expect(result.success).to.be.false;
      expect(result.errors[0].code).to.eq("required");
    });

    it("should fail and passthrough errors", function () {
      const rule = obj({ test: invalidRule });
      const result = rule([], { test: "invalid_value" }, ctx) as Invalid;

      expect(result.success).to.be.false;
      expect(result.errors[0].code).to.eq("error_code");
    });

    it("should disallow invalid input type", function () {
      const rule = obj({ test: validRule });
      invalidInput.forEach((type) => {
        const result = rule([], type, ctx) as Invalid;

        expect(result.success).to.be.false;
        expect(result.errors[0].code).to.eq("invalid_type");
      });
    });

    describe("path", function () {
      it("should provide a correct path", function () {
        const rule = obj({ one: invalidRule });
        const result = rule([], { one: "invalid_value" }, ctx) as Invalid;

        expect(result.errors[0].path).to.eql(["one"]);
      });

      it("should provide a correct path when nested", function () {
        const rule = obj({ one: obj({ two: invalidRule }) });
        const result = rule([], { one: { two: "Bart" } }, ctx) as Invalid;

        expect(result.errors[0].path).to.eql(["one", "two"]);
      });
    });
  });
});
