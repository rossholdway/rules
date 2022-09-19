import { expect } from "https://cdn.skypack.dev/chai@4.3.4?dts";
import { describe, it } from "https://deno.land/std@0.145.0/testing/bdd.ts";

import { isValidRule } from "../src/helpers.ts";

describe("helpers", function () {
  describe("isValidRule", function () {
    it("should return true when given valid result", function () {
      const result = isValidRule({ success: true, value: "Duff Gardens" });
      expect(result).to.be.true;
    });

    it("should return false when given invalid result", function () {
      const result = isValidRule({ success: false });
      expect(result).to.be.false;
    });
  });
});
