import { expect } from "https://cdn.skypack.dev/chai@4.3.4?dts";
import { describe, it } from "https://deno.land/std@0.145.0/testing/bdd.ts";

import { ctx } from "../utils.ts";
import type { Invalid } from "./../../src/mod.ts";
import { never } from "../../src/rules/never.ts";

describe("never", function () {
  const rule = never();

  const invalidInput = [
    undefined,
    null,
    {},
    [],
    "string",
    1,
    0,
    true,
    false,
    Symbol("test"),
    BigInt(Number.MAX_SAFE_INTEGER),
    () => {
      return "noop";
    },
    new Set(),
    new Map(),
  ];

  describe("valid", function () {
    it("should disallow all input types", function () {
      invalidInput.forEach((type) => {
        const result = rule([], type, ctx) as Invalid;

        expect(result.success).to.be.false;
        expect(result.errors[0].code).to.eq("invalid");
      });
    });
  });
});
