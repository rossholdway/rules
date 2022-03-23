import { Invalid, InvalidRefined, Valid } from "./index";

// type errorGroup = { [key: string]: errorObject };
// type errorObject = {value: unknown, path: string[], errors:  Omit<Err, "value" | "path">[] };

// export function groupErrors(arr: Err[]): errorGroup => {
//   return arr.reduce((storage, error) => {
//     const group = error.path.length === 0 ? "rule" : error.path.join(".");
//       storage[group] = storage[group] || {
//         value: error.value,
//         path: error.path,
//         errors: []
//       };
//       storage[group].errors.push({
//         name: error.name,
//         code: error.code,
//         message: error.message
//       });
//     return storage;
//   }, {} as errorGroup);
// };

export function isValidResult<Output>(result: Valid<Output> | Invalid | InvalidRefined): result is Valid<Output> {
  return result.success;
}
