import { Invalid, InvalidRefined, Valid } from "./index";

export function isValidResult<Output, Input = unknown>(result: Valid<Output> | Invalid<Input>): result is Valid<Output> {
  return result.success;
}

export function isValidRefinedResult<Output, Input = unknown>(result: Valid<Output> | InvalidRefined): result is Valid<Output> {
  return result.success;
}