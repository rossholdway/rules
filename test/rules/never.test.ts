import { expect } from "chai";
import { describe, it, beforeEach } from "@std/testing/bdd";

import { ctx } from "../utils.ts";
import type { Invalid, Err } from "./../../src/mod.ts";
import { never } from "../../src/rules/never.ts";

describe("never", function () {
  let errors: Err[] = [];
  const rule = never();

  const invalidInput = [
    undefined,
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
    it("should disallow all input types", function () {
      invalidInput.forEach((type) => {
        const result = rule(ctx(rule.name, type, errors)) as Invalid;

        expect(result.success).to.be.false;
        expect(errors[0].code).to.eq("invalid");
      });
    });
  });
});
