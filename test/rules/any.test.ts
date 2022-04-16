import { expect } from "chai";

import { any } from "../../src/rules/any";

describe("any", function() {
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
    () => { return "noop"; },
    new Set(),
    new Map()
  ];

  describe("valid", function() {
    it("should allow all inputs", function() {
      inputs.forEach(type => {
        const result = rule([], type, this.ctx);
        expect(result.success).to.be.true;
      });
    });
  });

});
