import { Rule } from "..";

/**
 * Any validation
 * *****************************************************************
 */
export type anything = typeof any;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function any(): Rule<any> {
  return function any(path, value, _ctx) {  
    return { success: true, value };
  };
}
