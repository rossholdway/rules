import { expect } from "chai";
import Sinon from "sinon";

import { nullable } from "../../src/utils/nullable";

describe("nullable", function() {

  it("should pass when value is null", function() {
    const util = nullable(this.validRule);
    const result = util([], null, this.ctx);

    Sinon.assert.notCalled(this.validRule);
    expect(result.success).to.be.true;
  });

  it("should call rule when value is defined", function() {
    const util = nullable(this.validRule);
    util([], "Flaming Moe", this.ctx);

    Sinon.assert.calledOnceWithExactly(this.validRule, [], "Flaming Moe", this.ctx);
  });

});
