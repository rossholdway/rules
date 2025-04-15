import { expect } from "chai";
import { describe, it, beforeEach } from "std/testing/bdd.ts";

import { ctx } from "../utils.ts";
import type { Err } from "./../../src/mod.ts";
import { regex } from "../../src/rules/regex.ts";

describe("regex", function () {
  let errors: Err[] = [];
  const rule = regex(/Bart/i);

  const invalidInput = [
    null,
    {},
    [],
    //"string",
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
    it("should match a valid string", function () {
      expect(rule(ctx(rule.name, "Bart")).success).to.be.true;
      expect(rule(ctx(rule.name, "El Barto")).success).to.be.true;
    });
  });

  describe("invalid", function () {
    it("should disallow undefined", function () {
      const result = rule(ctx(rule.name, undefined, errors));

      expect(result.success).to.be.false;
      expect(errors[0].code).to.eq("required");
    });

    it("should disallow invalid input type", function () {
      invalidInput.forEach((type) => {
        const result = rule(ctx(rule.name, type, errors));

        expect(result.success).to.be.false;
        expect(errors[0].code).to.eq("invalid_type");
      });
    });

    it("should not match an invalid string", function () {
      const result = rule(ctx(rule.name, "Homer", errors))
      expect(result.success).to.be.false;
      expect(errors[0].code).to.eq("invalid_format");
    });
  });
});
