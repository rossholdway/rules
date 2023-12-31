import { expect } from "chai";
import { describe, it, beforeEach } from "std/testing/bdd.ts";

import { Context, Err } from "../../src/mod.ts"
import { any } from "../../src/rules/any.ts";

describe("any", function () {
  let errors: Err[] = [];
  const rule = any();

  const inputs = [
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
    it("should allow all inputs", function () {
      inputs.forEach((type) => {
        const result = rule(new Context(rule.name, type, [], errors));
        expect(result.success).to.be.true;
      });
    });
  });
});
