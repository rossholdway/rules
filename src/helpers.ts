import { Invalid, InvalidRefined, Valid } from "./index";

export function isValidResult<Output>(result: Valid<Output> | Invalid): result is Valid<Output> {
  return result.success;
}

export function isValidRefinedResult<Output>(result: Valid<Output> | InvalidRefined): result is Valid<Output> {
  return result.success;
}