import { Err, Invalid, InvalidRefined, Rule, Valid } from "..";
import { isValidRefinedResult, isValidResult } from "../helpers";

export type RefinedErr = {
  code: string;
  message: string;
}

export function refine<Output>(
    name: string,
    ruleFn: Rule<Output>,
    customFn: (value: Output, ctx: unknown) => Valid<Output> | InvalidRefined
  ): Rule<Output> {
  return function refine(path, value, ctx) {

    // Run initial rule
    const result = ruleFn(path, value, ctx);

    if (!isValidResult(result)) {
      result.errors = result.errors.map((e) => {
        e.name = name // Overwrite with our custom name
        return e;
      })
      return result;
    }

    // We passed the above, now run the custom rule
    const custom = customFn(result.value, ctx);

    if (isValidRefinedResult(custom)) {
      return custom
    } else {
      // No point in exposing the value, name
      // or path props to the user writing the
      // refine method, so we add them back in here
      return {
        success: false,
        errors: custom.errors.map((e) => {
          return {
            value: result.value,
            name,
            path,
            code: e.code,
            message: e.message
          }
        })
      }
    }
  };
}