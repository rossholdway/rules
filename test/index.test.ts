import { expect } from "chai";
import sinon from "sinon";

import { ctx, isValid, parse } from "../src";
import Sinon from "sinon";

describe("index", function() {
  let ctx: ctx;
  let validRule: Sinon.SinonSpy;
  let invalidRule: Sinon.SinonSpy;

  beforeEach(function() {
    validRule = sinon.spy((_path, value, _ctx) => ({success: true, value}));
    invalidRule = sinon.spy((path, value, _ctx) => ({
      success: false,
      errors: [{
        value, name: "rule", path,
        code: "error_code",
        message: "An error occured"
      }]
    }));
    ctx = {};
  });

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
      const result = parse(validRule, "Marge");
      
      expect(result[0]).to.be.undefined;
      expect(result[1]).to.eq("Marge");
    });

    it("should return expected invalid response", function() {
      const result = parse(invalidRule, "Marge");
      
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
