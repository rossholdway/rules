import { Err, Rule } from "..";
import { isValidResult } from "../helpers";

/**
 * Array validation
 * Value is an array or given rules
 * *****************************************************************
 */
export function array<T>(
  ruleFn: Rule<T>,
  { max, min}:
  { max?: number, min?: number } = {}
  ): Rule<T[]> {

  const name = "array";
  return function array(path, value, ctx) {
    const data: T[] = [];
    const errors: (Err|Err[])[] = [];

    // Require a value
    if (typeof value === "undefined") {
      return {
        success: false,
        errors: [{
          value, name, path,
          code: "required",
          message: `${path[path.length - 1]} is required`
        }]
      };
    }

    if (!Array.isArray(value)) {
      return {
        success: false,
        errors: [{
          value, name, path,
          code: "invalid_type",
          message: "Must be an array",
        }]
      };
    }

    if (min && value.length < min) {
      return {
        success: false,
        errors: [{
          value, name, path,
          code: "invalid_min_length",
          message: `Must not be less than ${min} entries`
        }]
      };
    }

    if (max && value.length > max) {
      return {
        success: false,
        errors: [{
          value, name, path,
          code: "invalid_max_length",
          message: `Must not be greater than ${max} entries`
        }]
      };
    }
    
    // if (unique && value.length !== new Set(value).size) {
    //   errors.push({code: "invalid_max_length", message: "Duplicate values are not permitted"});
    // }

    for (const [i, v] of value.entries()) {
      const result = ruleFn([...path, i.toString()], v, ctx);
      if (isValidResult(result)) {
        data.push(result.value);
      } else {
        errors.push(result.errors);
      }
    }

    return (errors.length === 0) ? { success: true, value: data } : { success: false, errors: errors.flat() };
  };
}