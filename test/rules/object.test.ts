import { expect } from "https://cdn.skypack.dev/chai@4.3.4?dts";
import { describe, it, beforeEach } from "https://deno.land/std@0.145.0/testing/bdd.ts";

import { ctx, invalidRule, validRule } from "../utils.ts";
import type { Invalid, Err } from "./../../src/mod.ts";
import { obj } from "../../src/rules/object.ts";
import { str } from "../../src/rules/string.ts";

describe("object", function () {
  let errors: Err[] = [];
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

  beforeEach(() => {
    errors = [];
  });

  describe("valid", function () {
    it("should allow valid object", function () {
      const rule = obj({ test: validRule });
      const result = rule(ctx(rule.name, { test: "Bart" }));
      expect(result.success).to.be.true;
    });

    it("should support nested objects", function () {
      const rule = obj({ one: obj({ two: str() }) });
      const result = rule(ctx(rule.name, { one: { two: "Bart" } }));

      expect(result.success).to.be.true;
    });
  });

  describe("invalid", function () {
    it("should disallow undefined", function () {
      const rule = obj({ test: validRule });
      const result = rule(ctx(rule.name, undefined, errors)) as Invalid;

      expect(result.success).to.be.false;
      expect(errors[0].code).to.eq("required");
    });

    it("should fail and passthrough errors", function () {
      const rule = obj({ test: invalidRule });
      const result = rule(ctx(rule.name, { test: "invalid_value" }, errors)) as Invalid;

      expect(result.success).to.be.false;
      expect(errors[0].code).to.eq("error_code");
    });

    it("should disallow invalid input type", function () {
      const rule = obj({ test: validRule });
      invalidInput.forEach((type) => {
        const result = rule(ctx(rule.name, type, errors)) as Invalid;

        expect(result.success).to.be.false;
        expect(errors[0].code).to.eq("invalid_type");
      });
    });

    describe("path", function () {
      it("should provide a correct path", function () {
        const rule = obj({ one: invalidRule });
        rule(ctx(rule.name, { one: "invalid_value" }, errors)) as Invalid;

        expect(errors[0].path).to.eql(["one"]);
      });

      it("should provide a correct path when nested", function () {
        const rule = obj({ one: obj({ two: invalidRule }) });
        rule(ctx(rule.name, { one: { two: "Bart" } }, errors)) as Invalid;

        expect(errors[0].path).to.eql(["one", "two"]);
      });
    });
  });
});
