import Sinon from "sinon";

import { defaulted } from "../../src/utils/defaulted";

describe("defaulted", function() {

  it("should call callback when value is undefined", function() {
    const defaultedCb = Sinon.fake();
    const util = defaulted(this.validRule, defaultedCb);
    util([], undefined, this.ctx);

    Sinon.assert.calledWithExactly(defaultedCb, this.ctx);
  });

  it("should call rule with default value when undefined", function() {
    const defaultedCb = Sinon.fake.returns("Max Power");
    const util = defaulted(this.validRule, defaultedCb);
    util([], undefined, this.ctx);

    Sinon.assert.calledWithExactly(this.validRule, [], "Max Power", this.ctx);
  });

  it("should call rule with provided value when not undefined", function() {
    const defaultedCb = Sinon.fake();
    const util = defaulted(this.validRule, defaultedCb);
    util([], "Mr. Plow", this.ctx);

    Sinon.assert.calledWithExactly(this.validRule, [], "Mr. Plow", this.ctx);
  });

});
