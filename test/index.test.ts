import { expect } from "chai";

import { isValid, parse } from "../src";

describe("index", function() {

  describe("isValid", function() {

    it("should return false if invalid", function() {
      const result = isValid([[{
          value: "Burns",
          name: "enums",
          path: [ "simpsons" ],
          code: "invalid_enum",
          message: "Must be one of Homer, Marge, Bart, Lisa, Maggie"
        }], undefined]);
      
      expect(result).to.be.false;
    });

    it("should return true if valid", function() {
      const result = isValid([undefined, "Homer"]);
      
      expect(result).to.be.true;
    });

  });

  describe("parse", function() {

    it("should return expected valid response", function() {
      const result = parse(this.validRule, "Marge");
      
      expect(result[0]).to.be.undefined;
      expect(result[1]).to.eq("Marge");
    });

    it("should return expected invalid response", function() {
      const result = parse(this.invalidRule, "Marge");
      
      expect(result[0]).to.eql([{
        value: "Marge",
        name: "rule",
        path: [],
        code: "error_code",
        message: "An error occured"
      }]);
      expect(result[1]).to.be.undefined;
    });

  });

});
