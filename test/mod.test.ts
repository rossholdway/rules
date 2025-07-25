import { expect } from "chai";
import { describe, it } from "@std/testing/bdd";

import { invalidRule, validRule } from "./utils.ts";

import { parse, isValid, format, type Err } from "../src/mod.ts";

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
    it("should return expected defaults response", function () {
      const error: Err = {
        value: undefined,
        name: "invalidRule",
        path: [ "character", "first_name" ],
        code: "required",
        message: "is required",
        meta: undefined
      };
      const result = format(new Map([["character.first_name", [error]]]));

      expect(result).to.eql(new Map([["character.first_name", [{ code: "required", message: "Character first name is required" }]]]));
    });

    it("should return expected response when humanise is false", function () {
      const error: Err = {
        value: undefined,
        name: "invalidRule",
        path: [ "character", "first_name" ],
        code: "required",
        message: "is required",
        meta: undefined
      };
      const result = format(new Map([["character.first_name", [error]]]), { humanise: false });

      expect(result).to.eql(new Map([["character.first_name", [{ code: "required", message: "character.first_name is required" }]]]));
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
