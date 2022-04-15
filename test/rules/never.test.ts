import { expect } from "chai";

import { Invalid } from "../../src";
import { never } from "../../src/rules/never";

describe("never", function() {
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
    () => { return "noop"; },
    new Set(),
    new Map()
  ];

  describe("valid", function() {
    it("should disallow all input types", function() {
      invalidInput.forEach(type => {
        const result = rule([], type, this.ctx) as Invalid;

        expect(result.success).to.be.false;
        expect(result.errors[0].code).to.eq("invalid");
      });
    });
  });

});