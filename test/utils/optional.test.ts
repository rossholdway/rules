import { expect } from "chai";

import { optional } from "../../src/utils/optional";

describe("optional", function() {

  it("should pass when value is undefined", function() {
    const util = optional(this.invalidRule);
    const result = util([], undefined, this.ctx);

    expect(result.success).to.be.true;
  });

  it("should call rule when value is defined", function() {
    const util = optional(this.validRule);
    util([], "Flaming Moe", this.ctx);

    expect(this.validRule.calledOnceWithExactly([], "Flaming Moe", this.ctx)).to.be.true;
  });

});
