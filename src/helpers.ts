import { Invalid, InvalidRefined, Valid } from "./mod.ts";

export function isValidResult<Output>(
  result: Valid<Output> | Invalid | InvalidRefined,
): result is Valid<Output> {
  return result.success;
}
