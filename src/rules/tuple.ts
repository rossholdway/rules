import { Codes, Err, Infer, InferTuple, Rule } from "..";
import { isValidResult } from "../helpers";

/**
 * Tuple validation
 * *****************************************************************
 */
export type tuple = typeof tuple;

// export function tuple<A>(rules: [Rule<A>]): Rule<[A]>;
// export function tuple<A, B>(rules: [Rule<A>, Rule<B>]): Rule<[A, B]>;
// export function tuple<A, B, C>(rules: [Rule<A>, Rule<B>, Rule<C>]): Rule<[A, B, C]>;
// export function tuple<A, B, C, D>(rules: [Rule<A>, Rule<B>, Rule<C>, Rule<D>]): Rule<[A, B, C, D]>;
// export function tuple(rules: Rule<any>[]): Rule<any>

export function tuple<T extends Rule<Infer<T[number]>>[]>(
  ruleSet:[...T]
): Rule<[...InferTuple<T>]> {
  const name = "tuple";
  return function tuple(path, value, ctx) {
    const data: unknown[] = [];
    const errors: (Err|Err[])[] = [];

    //Require a value
    if (typeof value === "undefined") {
      return {
        success: false,
        errors: [{
          value, name, path,
          code: Codes.required,
          message: "Required"
        }]
      };
    }

    if (!Array.isArray(value)) {
      return {
        success: false,
        errors: [{
          value, name, path,
          code: Codes.invalid_type,
          message: "Must be an array",
        }]
      };
    }

    if((ruleSet.length === 0 || value.length === 0) || (ruleSet.length !== value.length)) {
      return {
        success: false,
        errors: [{
          value, name, path,
          code: Codes.invalid_length,
          message: `Invalid number of items. Expected ${ruleSet.length}, got ${value.length}`,
          meta: {expected: ruleSet.length, actual: value.length}
        }]
      };
    }

    for (const [i, rule] of ruleSet.entries()) {
      const result = rule([...path, i.toString()], value[i], ctx);
      if (isValidResult(result)) {
        data.push(result.value);
      } else {
        errors.push(result.errors);
      }
    }

    return (errors.length === 0) ?
      { success: true, value: (data as [...InferTuple<T>]) } :
      { success: false, errors: errors.flat() };
  };
}
