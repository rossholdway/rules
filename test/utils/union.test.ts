import { expect } from "chai";
import Sinon from "sinon";

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

    Sinon.assert.calledOnce(this.invalidRule);
    Sinon.assert.calledOnce(this.validRule);
  });

  it("should return valid on first rule pass", function() {
    const util = union([this.validRule, this.validRule, this.validRule]);
    const result = util([], "Moe", this.ctx) as Valid<string>;

    Sinon.assert.calledOnce(this.validRule);
    expect(result.success).to.be.true;
    expect(result.value).to.eq("Moe");
  });

  it("should return invalid if all rules fail", function() {
    const util = union([this.invalidRule, this.invalidRule, this.invalidRule]);
    const result = util([], "Homer", this.ctx) as Invalid;

    expect(result.success).to.be.false;
    expect(result.errors.length).to.eq(4);
  });

  it("should return errors", function() {
    const util = union([this.invalidRule]);
    const result = util([], "Bart", this.ctx) as Invalid;

    expect(result.success).to.be.false;
    expect(result.errors).to.eql([
      {
        value: "Bart",
        name: "union",
        path: [],
        code: "invalid_union",
        message: "Invalid input"
      },
      {
        value: "Bart",
        name: "rule",
        path: [],
        code: "error_code",
        message: "An error occured"
      }
    ]);
  });

});
