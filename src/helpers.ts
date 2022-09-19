import { Invalid, Valid } from "./mod.ts";

export function isValidRule<Output>(
  result: Valid<Output> | Invalid,
): result is Valid<Output> {
  return result.success;
}
