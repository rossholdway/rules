import Sinon from "sinon";

import { coerce } from "../../src/utils/coerce";

describe("coerce", function() {

  it("should call callback with expected argument", function() {
    const coerceCb = Sinon.fake.returns("742");
    const util = coerce(this.validRule, coerceCb);
    util([], 742, this.ctx);

    Sinon.assert.calledWithExactly(coerceCb, 742);
  });

  it("should call rule with coerced value", function() {
    const coerceCb = Sinon.fake.returns("742");
    const util = coerce(this.validRule, coerceCb);
    util([], 742, this.ctx);

    Sinon.assert.calledWithExactly(this.validRule, [], "742", this.ctx);
  });

});
