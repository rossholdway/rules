import { expect } from "chai";
import sinon from "sinon";

import { ctx } from "../../src";
import { optional } from "../../src/utils/optional";
import Sinon from "sinon";

describe("optional", function() {
  let ctx: ctx;
  let rule: Sinon.SinonSpy;

  beforeEach(function() {
    rule = sinon.spy((path, value, _ctx) => {
      if (typeof value === "undefined") {
        return {
          success: false,
          errors: [{
            value, name: "rule", path,
            code: "required",
            message: "Required"
          }]
        };
      } else {
        return {success: true, value};
      }
    });
    ctx = {};
  });

  it("should pass when value is undefined", function() {
    const util = optional(rule);
    const result = util([], undefined, ctx);

    expect(rule([], undefined, ctx).success).to.be.false;
    expect(result.success).to.be.true;
  });

  it("should call rule when value is defined", function() {
    const util = optional(rule);
    util([], "Flaming Moe", ctx);

    expect(rule.calledWithExactly([], "Flaming Moe", ctx)).to.be.true;
  });

});
