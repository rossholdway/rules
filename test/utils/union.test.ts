import { expect } from "chai";

import { Invalid, Valid } from "../../src";
import { union } from "../../src/utils/union";

describe("union", function() {

  it("should disallow undefined", function() {
    const util = union([this.validRule]);
    const result = util([], undefined, this.ctx) as Invalid;

    expect(result.success).to.be.false;
    expect(result.errors[0].code).to.eq("required");
  });

  it("should call each rule until valid", function() {
    const util = union([this.invalidRule, this.validRule, this.invalidRule]);
    util([], "Moe", this.ctx);

    expect(this.invalidRule.calledOnce).to.be.true;
    expect(this.validRule.calledOnce).to.be.true;
  });

  it("should return valid on first rule pass", function() {
    const util = union([this.validRule, this.validRule, this.validRule]);
    const result = util([], "Moe", this.ctx) as Valid<string>;

    expect(this.validRule.calledOnce).to.be.true;
    expect(result.success).to.be.true;
    expect(result.value).to.eq("Moe");
  });

  it("should return invalid if all rules fail", function() {
    const util = union([this.invalidRule, this.invalidRule, this.invalidRule]);
    const result = util([], "Homer", this.ctx) as Invalid;

    expect(result.success).to.be.false;
    expect(result.errors.length).to.eq(3);
  });

  it("should return errors", function() {
    const util = union([this.invalidRule]);
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
