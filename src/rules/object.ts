import { Err, Rule } from "..";
import { isValidResult } from "../helpers";

/**
 * Object validation
 * *****************************************************************
 */
function isObject(value: any): value is Record<string, unknown> {
  return (!!value) && (value.constructor === Object);
}
  
export function obj<T>(schema: {[Key in keyof T]: Rule<T[Key]>}): Rule<T> {
  const name = "object";
  return function obj(path, value, ctx) {
    const data = {} as {[Key in keyof T]: T[Key]};
    const errors: (Err|Err[])[] = [];

    if(!isObject(value)) {
      return {
        success: false,
        errors: [{
          value, name, path,
          code: "not_an_object",
          message: "Not an object",
        }]
      }
    } else {
      // I want keys only defined in the scheam to come through unvalidated..?
      // Realistic? and how would we do this...
      for (const prop in schema) {
        if (!Object.prototype.hasOwnProperty.call(schema, prop)) continue;
        const v = value[prop];
        
        // if (typeof v === "undefined") {
        //   failures.push({
        //     valid: false, value, rule: name, path,
        //     code: "required",
        //     message: "Required property missing",
        //   });
        //   continue;
        // }

        const ruleFn = schema[prop as keyof T];

        const result = ruleFn([...path, prop], v, ctx);
        //const stopOnFirstError = false; // THIS IS OBJECT LEVEL ONLY....? maybe not

        if (isValidResult(result)) {
          if (typeof result.value !== "undefined") {
            data[prop as keyof T] = result.value;
          }
        } else {
          errors.push(result.errors);
          //if (stopOnFirstError) { return result; }
        }

      }
    }

    return (errors.length === 0) ? { success: true, value: data } : { success: false, errors: errors.flat() };
  };
}