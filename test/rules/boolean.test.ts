import { expect } from "chai";
import { describe, it, beforeEach } from "@std/testing/bdd";

import { ctx } from "../utils.ts";
import type { Invalid, Err } from "./../../src/mod.ts";
import { bool } from "../../src/rules/boolean.ts";

describe("boolean", function () {
  let errors: Err[] = [];
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

  beforeEach(() => {
    errors = [];
  });

  describe("valid", function () {
    it("should allow type of boolean", function () {
      expect(rule(ctx(rule.name, true)).success).to.be.true;
      expect(rule(ctx(rule.name, false)).success).to.be.true;
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
        expect(errors[0].code).to.eq("invalid_type");
      });
    });
  });
});
