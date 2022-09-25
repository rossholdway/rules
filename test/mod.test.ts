import { expect } from "https://cdn.skypack.dev/chai@4.3.4?dts";
import { describe, it } from "https://deno.land/std@0.145.0/testing/bdd.ts";

import { invalidRule, validRule } from "./utils.ts";

import { parse, isValid } from "../src/mod.ts";

describe("mod", function () {
  describe("isValid", function () {
    it("should return false if invalid", function () {
      const result = isValid([[{
        value: "Burns",
        name: "enums",
        path: ["simpsons"],
        code: "invalid_enum",
        message: "Must be one of Homer, Marge, Bart, Lisa, Maggie",
      }], undefined]);

      expect(result).to.be.false;
    });

    it("should return true if valid", function () {
      const result = isValid([undefined, "Homer"]);

      expect(result).to.be.true;
    });
  });

  describe("parse", function () {
    it("should return expected valid response", function () {
      const result = parse(validRule, "Marge");

      expect(result[0]).to.be.undefined;
      expect(result[1]).to.eq("Marge");
    });

    it("should return expected invalid response", function () {
      const result = parse(invalidRule, "Marge");

      expect(result[0]).to.eql([{
        value: "Marge",
        name: "invalidRule",
        path: [],
        code: "error_code",
        message: "An error occured",
        meta: undefined
      }]);
      expect(result[1]).to.be.undefined;
    });
  });
});
