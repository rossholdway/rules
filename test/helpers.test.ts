import { expect } from "chai";
import { isValidResult } from "../src/helpers";

describe("helpers", function() {

  describe("isValidResult", function() {

    it("should return true when given valid result", function() {
      const result = isValidResult({success: true, value: "Duff Gardens"});
      
      expect(result).to.be.true;
    });

    it("should return false when given invalid result", function() {
      const result = isValidResult({
        success: false,
        errors: [{
          value: "Monorail, Monorail, Monorail",
          name: "rule",
          path: [],
          code: "error_code",
          message: "An error occured"
        }]
      });
      
      expect(result).to.be.false;
    });

  });

});
