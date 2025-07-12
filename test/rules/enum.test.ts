import { expect } from "chai";
import { describe, it, beforeEach } from "@std/testing/bdd";

import { ctx } from "../utils.ts";
import type { Invalid, Err } from "./../../src/mod.ts";
import { enums } from "../../src/rules/enum.ts";

describe("enum", function () {
  let errors: Err[] = [];
  const rule = enums(["Maggie", "Gerald", "Ling"]);

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

  beforeEach(() => {
    errors = [];
  });

  describe("valid", function () {
    it("should allow any of the predefined values", function () {
      expect(rule(ctx(rule.name, "Maggie")).success).to.be.true;
      expect(rule(ctx(rule.name, "Gerald")).success).to.be.true;
      expect(rule(ctx(rule.name, "Ling")).success).to.be.true;
    });
  });

  describe("invalid", function () {
    it("should disallow undefined", function () {
      const result = rule(ctx(rule.name, undefined, errors)) as Invalid;

      expect(result.success).to.be.false;
      expect(errors[0].code).to.eq("required");
    });

    it("should disallow invalid input type", function () {
      invalidInput.forEach((type) => {
        const result = rule(ctx(rule.name, type, errors)) as Invalid;

        expect(result.success).to.be.false;
        expect(errors[0].code).to.eq("invalid_enum");
      });
    });

    it("should disallow unknown values", function () {
      const result = rule(ctx(rule.name, "Mr. Sparkle", errors)) as Invalid;

      expect(result.success).to.be.false;
      expect(errors[0].code).to.eq("invalid_enum");
    });
  });
});
