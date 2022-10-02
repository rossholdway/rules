import { expect } from "https://cdn.skypack.dev/chai@4.3.4?dts";
import { describe, it } from "https://deno.land/std@0.145.0/testing/bdd.ts";

import { invalidRule, validRule } from "./utils.ts";

import { parse, isValid, format, Err } from "../src/mod.ts";

describe("mod", function () {
  describe("isValid", function () {
    it("should return false if invalid", function () {
      const error: Err = {
        value: "Burns",
        name: "enums",
        path: ["simpsons"],
        code: "invalid_enum",
        message: "Must be one of Homer, Marge, Bart, Lisa, Maggie",
      };
      const result = isValid([new Map([["simpsons", [error]]]), undefined]);

      expect(result).to.be.false;
    });

    it("should return true if valid", function () {
      const result = isValid([undefined, "Homer"]);

      expect(result).to.be.true;
    });
  });

  describe("format", function () {
    it("should return expected response", function () {
      const error: Err = {
        value: undefined,
        name: "invalidRule",
        path: [ "character", "first_name" ],
        code: "required",
        message: "is required",
        meta: undefined
      };
      const result = format(new Map([["character.first_name", [error]]]));

      expect(result).to.eql(new Map([["character.first_name", [ "Character first name is required" ]]]));
    });
  });

  describe("parse", function () {
    it("should return expected valid response", function () {
      const result = parse(validRule, "Marge");

      expect(result[0]).to.be.undefined;
      expect(result[1]).to.eq("Marge");
    });

    it("should return expected invalid response", function () {
      const error: Err = {
        value: "Marge",
        name: "invalidRule",
        path: [],
        code: "error_code",
        message: "An error occured",
        meta: undefined
      };
      const result = parse(invalidRule, "Marge");

      expect(result[0]).to.eql(new Map([["value", [error]]]));
      expect(result[1]).to.be.undefined;
    });
  });
});
