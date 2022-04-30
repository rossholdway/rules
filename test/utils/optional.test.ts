import { expect } from "chai";
import Sinon from "sinon";

import { optional } from "../../src/utils/optional";

describe("optional", function() {

  it("should pass when value is undefined", function() {
    const util = optional(this.validRule);
    const result = util([], undefined, this.ctx);

    Sinon.assert.notCalled(this.validRule);
    expect(result.success).to.be.true;
  });

  it("should call rule when value is defined", function() {
    const util = optional(this.validRule);
    util([], "Flaming Moe", this.ctx);

    Sinon.assert.calledOnceWithExactly(this.validRule, [], "Flaming Moe", this.ctx);
  });

});
