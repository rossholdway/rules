import { expect } from "https://cdn.skypack.dev/chai@4.3.4?dts";
import {
  beforeEach,
  describe,
  it,
} from "https://deno.land/std@0.145.0/testing/bdd.ts";

import { ctx, invalidRule, sandbox, validRule } from "../utils.ts";
import type { Invalid, InvalidRefined, Valid } from "./../../src/mod.ts";

import { refine } from "../../src/utils/refine.ts";

describe("refine", function () {
  let refineCb: sinon.SinonSpy<
    [value: string, _ctx: typeof ctx],
    Valid<string> | InvalidRefined
  >;
  let result: Valid<string> | Invalid;

  beforeEach(function () {
    refineCb = sandbox.fake(
      function (
        value: string,
        _ctx: typeof ctx,
      ): Valid<string> | InvalidRefined {
        if (/\S+@\S+\.\S+/.test(value)) {
          return { success: true, value };
        } else {
          return {
            success: false,
            errors: [{
              code: "invalid_email",
              message: "Must be a valid email",
            }],
          };
        }
      },
    );
  });

  it("should return success when valid", function () {
    const util = refine("email", validRule, refineCb);
    result = util([], "chunkylover53@aol.com", ctx) as Valid<string>;

    expect(result.success).to.be.true;
    expect(result.value).to.eq("chunkylover53@aol.com");
  });

  describe("initial rule", function () {
    it("should be called", function () {
      const util = refine("email", validRule, refineCb);
      result = util([], "chunkylover53@aol.com", ctx);

      sandbox.assert.calledOnceWithExactly(
        validRule,
        [],
        "chunkylover53@aol.com",
        ctx,
      );
    });

    it("should return on error", function () {
      const util = refine("email", invalidRule, refineCb);
      result = util([], 742, ctx) as Invalid;

      expect(result.errors.length).to.eq(1);
      expect(result.errors).to.eql([{
        value: 742,
        name: "email", // Using custom name
        path: [],
        code: "error_code",
        message: "An error occured",
      }]);
    });
  });

  describe("custom rule", function () {
    it("should be called", function () {
      const util = refine("email", validRule, refineCb);
      result = util([], "chunkylover53@aol.com", ctx);

      sandbox.assert.calledOnceWithExactly(
        refineCb,
        "chunkylover53@aol.com",
        ctx,
      );
    });

    it("should return on error", function () {
      const util = refine("email", validRule, refineCb);
      result = util([], "not_an_email", ctx) as Invalid;

      expect(result.errors.length).to.eq(1);
      expect(result.errors).to.eql([{
        value: "not_an_email",
        name: "email", // Using custom name
        path: [],
        code: "invalid_email",
        message: "Must be a valid email",
      }]);
    });
  });
});
