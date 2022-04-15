import { expect } from "chai";

import { nullable } from "../../src/utils/nullable";

describe("nullable", function() {

  it("should pass when value is null", function() {
    const util = nullable(this.validRule);
    const result = util([], null, this.ctx);

    expect(this.validRule.notCalled).to.be.true;
    expect(result.success).to.be.true;
  });

  it("should call rule when value is defined", function() {
    const util = nullable(this.validRule);
    util([], "Flaming Moe", this.ctx);

    expect(this.validRule.calledOnceWithExactly([], "Flaming Moe", this.ctx)).to.be.true;
  });

});
