import { expect } from "https://cdn.skypack.dev/chai@4.3.4?dts";
import { describe, it, beforeEach } from "https://deno.land/std@0.145.0/testing/bdd.ts";

import { ctx } from "../utils.ts";
import type { Invalid, Err } from "./../../src/mod.ts";
import { str } from "../../src/rules/string.ts";

describe("string", function () {
  let errors: Err[] = [];
  const rule = str();
  type Valid = Exclude<ReturnType<typeof rule>, Invalid>;

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
    it("should allow type of string", function () {
      expect(rule(ctx(rule.name, "a string")).success).to.be.true;
    });

    it("should trim text", function () {
      const rule = str({ trim: true });
      const result = rule(ctx(rule.name, " Lisa ")) as Valid;

      expect(result.success).to.be.true;
      expect(result.value).to.eq("Lisa");
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

    describe("options", function () {
      it("should disallow input less than min length", function () {
        const rule = str({ min: 10 });
        const result = rule(ctx(rule.name, "Homer", errors)) as Invalid;

        expect(result.success).to.be.false;
        expect(errors[0].code).to.eq("invalid_min_length");
      });

      it("should disallow input greater than max length", function () {
        const rule = str({ max: 3 });
        const result = rule(ctx(rule.name, "Lisa", errors)) as Invalid;

        expect(result.success).to.be.false;
        expect(errors[0].code).to.eq("invalid_max_length");
      });

      it("should disallow blank string", function () {
        const rule = str({ min: 1, trim: true });
        const result = rule(ctx(rule.name, "    ", errors)) as Invalid;

        expect(result.success).to.be.false;
        expect(errors[0].code).to.eq("invalid_min_length");
      });
    });
  });
});
