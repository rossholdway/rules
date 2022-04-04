import { InvalidRefined, Rule, Valid, ctx, Err } from "..";
import { isValidResult } from "../helpers";

export type RefinedErr = Omit<Err, "value" | "name" | "path">
export type refineCb<Output> = (value: Output, ctx: ctx) => Valid<Output> | InvalidRefined;

export function refine<Output>(
    name: string,
    ruleFn: Rule<Output>,
    customFn: refineCb<Output>
  ): Rule<Output> {
  return function refine(path, value, ctx) {

    // Run initial rule
    const result = ruleFn(path, value, ctx);

    if (!isValidResult(result)) {
      result.errors = result.errors.map((e) => {
        e.name = name; // Overwrite with our custom name
        return e;
      });
      return result;
    }

    // We passed the above, now run the custom rule
    const custom = customFn(result.value, ctx);

    if (isValidResult(custom)) {
      return custom;
    } else {
      // No point in exposing the value, name
      // or path props to the user writing the
      // refine method, so we add them back in here
      return {
        success: false,
        errors: custom.errors.map((err) => {
          return {
            value: result.value,
            name,
            path,
            ...err
          };
        })
      };
    }
  };
}