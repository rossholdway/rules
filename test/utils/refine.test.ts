import { expect } from "chai";
import {
  beforeEach,
  describe,
  it,
} from "std/testing/bdd.ts";

import { ctx, invalidRule, sandbox, validRule } from "../utils.ts";
import type { Invalid, Valid, Context, Err } from "./../../src/mod.ts";

import { refine } from "../../src/utils/refine.ts";

describe("refine", function () {
  let refineCb: sinon.SinonSpy<
    [ctx: Context<string>],
    Valid<string> | Invalid
  >;
  let result: Valid<string> | Invalid;
  let errors: Err[] = [];

  beforeEach(function () {
    errors = [];
    refineCb = sandbox.fake(
      function (
        ctx: Context<string>,
      ): Valid<string> | Invalid {
        if (/\S+@\S+\.\S+/.test(ctx.value)) {
          return ctx.success();
        } else {
          return ctx.error("invalid_email", "Must be a valid email")
        }
      },
    );
  });

  it("should return success when valid", function () {
    const util = refine("email", validRule, refineCb);
    result = util(ctx(util.name, "chunkylover53@aol.com")) as Valid<string>;

    expect(result.success).to.be.true;
    expect(result.value).to.eq("chunkylover53@aol.com");
  });

  describe("initial rule", function () {
    it("should be called", function () {
      const util = refine("email", validRule, refineCb);
      const context = ctx(util.name, "chunkylover53@aol.com");
      result = util(context);

      sandbox.assert.calledOnceWithExactly(
        validRule,
        context,
      );
    });

    it("should return on error", function () {
      const util = refine("email", invalidRule, refineCb);
      result = util(ctx(util.name, 742, errors)) as Invalid;

      expect(errors.length).to.eq(1);
      expect(errors).to.eql([{
        value: 742,
        name: "email", // Using custom name
        path: [],
        code: "error_code",
        message: "An error occured",
        meta: undefined
      }]);
    });
  });

  describe("custom rule", function () {
    it("should be called", function () {
      const util = refine("email", validRule, refineCb);
      const context = ctx(util.name, "chunkylover53@aol.com");
      result = util(context);

      sandbox.assert.calledOnceWithExactly(
        refineCb,
        context as Context<string>
      );
    });

    it("should return on error", function () {
      const util = refine("email", validRule, refineCb);
      result = util(ctx(util.name, "not_an_email", errors)) as Invalid;

      expect(errors.length).to.eq(1);
      expect(errors).to.eql([{
        value: "not_an_email",
        name: "email", // Using custom name
        path: [],
        code: "invalid_email",
        message: "Must be a valid email",
        meta: undefined
      }]);
    });
  });
});
