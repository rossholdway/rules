import { expect } from "chai";

import { Valid, Invalid } from "../../src";
import { intersection } from "../../src/utils/intersection";

describe("intersection", function() {

  it("should disallow undefined", function() {
    const util = intersection([this.validRule]);
    const result = util([], undefined, this.ctx) as Invalid;

    expect(result.success).to.be.false;
    expect(result.errors[0].code).to.eq("required");
  });

  it("should call every rule", function() {
    const util = intersection([this.validRule, this.invalidRule, this.validRule]);
    util([], "Bart", this.ctx);

    expect(this.validRule.calledTwice).to.be.true;
    expect(this.invalidRule.calledOnce).to.be.true;
  });

  it("should return valid if all rules pass", function() {
    const util = intersection([this.validRule, this.validRule, this.validRule]);
    const result = util([], "Bart", this.ctx) as Valid<string>;

    expect(result.success).to.be.true;
    expect(result.value).to.eq("Bart");
  });

  it("should return invalid if any rule fails", function() {
    const util = intersection([this.validRule, this.validRule, this.invalidRule]);
    const result = util([], "Bart", this.ctx);

    expect(result.success).to.be.false;
  });

  it("should return errors", function() {
    const util = intersection([this.invalidRule]);
    const result = util([], "Bart", this.ctx) as Invalid;

    expect(result.success).to.be.false;
    expect(result.errors).to.eql([{
      value: "Bart",
      name: "rule",
      path: [],
      code: "error_code",
      message: "An error occured"
    }]);
  });

});
