// @ts-ignore
import benchmark from "benchmark";
import { performance } from "perf_hooks";
import { array, coerce, defaulted, enums, isValid, literal, obj, parse, str, dynamic, intersection, optional} from ".";
import { refine } from "./utils/refine";


enum Pokemon {
  Pikachu = "Pikachu",
  Charizard = "Charizard",
  Mewtwo = "Mewtwo"
}

enum PokemonCodes {
  Pikachu,
  Charizard,
  Mewtwo
}



// const schema = obj({
//   name:       str(),
//   knownAs:    optional(str()),
//   age:        defaulted(str(), (value, ctx) => "30"),
//   levels:     array(
//                 intersection([str(), literal("Hello")]),
//                 { min: 1, max: 3 }
//               ),
//   occupation: intersection([str(), literal("Developer")]),
//   height:     dynamic((value, ctx) => {
//                 if(value === "5.6") {
//                   return str();
//                 } else {
//                   return enums(Pokemon);
//                 }
//               }),
//   sex:        union([
//                 literal("Male"),
//                 literal("Female"),
//                 literal(0),
//                 array(str())
//               ]),
//   bmi:        coerce(str(), (value) => {
//                 if (typeof value === "number") {
//                   return value.toString();
//                 } else {
//                   return null;
//                 }
//               }),
//   pokemon:   enums(Pokemon), //[ "Pikachu", "Charizard", "Mewtwo" ]
//   medals: obj({
//     gold: str(),
//     silver: array(str())
//   })
// });


// const t0 = performance.now();
// const result2 = parse(schema, {
//   name: "Ross",
//   knownAs: "Puffin",
//   //age: undefined,
//   levels: ["Hello"], //, 2, "3"],
//   occupation: "Developer",
//   height: "5.6",
//   sex: "Male",
//   bmi: 122,
//   pokemon: "Pikachu",
//   medals: {
//     gold: "1",
//     silver: [] // handle empty arrays...?
//   },
//   complicated: {
//     option1: "yes"
//   },
//   not_in_schema: "people"
// });
// const t1 = performance.now();
// console.log("Call to validate took " + (t1 - t0) + " milliseconds.");

// console.dir(result2, { depth: 4 });

// const schema3 = obj({
//     name: str()
//   });
//   const t0 = performance.now();
//   const result3 = parse(schema3, {
//     name: undefined
//   });
//   const t1 = performance.now();
//   console.log("Call to validate took " + (t1 - t0) + " milliseconds.");
//   console.dir(result3, { depth: 4 });
  
//   // User exposed "isValid"
//   if(isValid(result3)) {
//     result3[1].name;
//   } else {
//     result3[0];
//   }
  
  
  
  // // console.log("----single-----");
  
  // const schema2 = str();
  // const result3 = parse(schema2, true);
  // //console.dir(result3, { depth: 4 });
  
  
  /// BENCHMARK
  //const schema = str();
  
  // const suite = new benchmark.Suite;
  // suite.add("validate", function() {
  //   //v.parse(schema, "Ross");
  //   v.parse(schema, {
  //     name: "Ross",
  //     knownAs: "Puffin",
  //     age: undefined,
  //     levels: ["Hello"],// 2, "3"],
  //     occupation: "Developer",
  //     height: "5.6",//5.6,
  //     sex: "Male",
  //     bmi: 122,
  //     pokemon: "Pikachu",
  //     medals: {
  //       gold: "1",
  //       silver: []
  //     },
  //     not_in_schema: "people"
  //   });
  // })
  // suite.add("validate2", function() {
  //   validate3(schema, {
  //     name: 1,
  //     name2: 2,
  //     obj1: {
  //       name3: 3
  //     }
  //   });
  // })
  // .on("cycle", function(event: any) {
  //   console.log(String(event.target));
  // }).on("complete", function() {
  //   //@ts-ignore
  //   console.log("Fastest is " + this.filter("fastest").map("name"));
  // }).run({ "async": true });

  // STRING
  // const test1 = parse(str({min: 2}), "Hello");
  // console.dir(test1, { depth: 4 });

  // OBJECT
  const schema = obj({
    embeded: obj({
      hello: literal("World")
    }),
    name1: str({min: 2}),
    name2: literal("Ross"),
    pokemon: enums(Pokemon), //[ "Pikachu", "Charizard", "Mewtwo" ]
    levels: array(str(),{ min: 1, max: 3 }),
    bmi:  coerce(str(), (value) => {
      if (typeof value === "number") {
        return value.toString();
      } else {
        return null;
      }
    }),
    age: defaulted(str(), (value, ctx) => "30"),
    height: dynamic((value, ctx) => {
              if(value === "5.6") {
                return str();
              } else {
                return enums(Pokemon);
              }
            }),
    occupation: intersection([str(), enums(Pokemon)]),
    knownAs:    optional(str()),
    email: refine("email", str(), (value, ctx) => {
      
      // Is it a valid email?
      if (/\S+@\S+\.\S+/.test(value)) {
        return { success: true, value }
      } else {
        return {
          success: false,
          errors: [{
            code: "invalid_email",
            message: `Must be a valid email`
          }]
        }
      }

    })
  });

  const t0 = performance.now();
  const test2 = parse(schema,
    {
      embeded: {
        hello: "World",
      },
      name1: "A1",
      name2: "Ross",
      pokemon: "Charizard",
      levels: ["1", "2"],
      bmi: 1,
      height: "5.6",
      occupation: "Pikachu",
      knownAs: "me",
      email: "ello@stackbase.dev"
    }
  );
  const t1 = performance.now();
  console.log("Call to validate took " + (t1 - t0) + " milliseconds.");

  console.dir(test2, { depth: 4 });

  if(isValid(test2)) {
    test2[1].pokemon
  }


  //TODO

  // Remove the Input type? Can't it always be unknown....
  // Make email validation / validation methods easy to provide not inline
  // Do union
  // Test
  // Wrtie a few more default validators
  // Revist enums...? Don't use typescript ones..?
  // Write unit tests
  // Done


  // BENCHMARK

  // const suite = new benchmark.Suite;
  // suite.add("validate", function() {
  //   //v.parse(schema, "Ross");
  //   parse(schema,
  //     {
  //       embeded: {
  //         hello: "World",
  //       },
  //       name1: "A1",
  //       name2: "Ross",
  //       pokemon: "Charizard",
  //       levels: ["1", "2"],
  //       bmi: 1,
  //       height: "5.6",
  //       occupation: "Pikachu",
  //       knownAs: "me",
  //       email: "ello@stackbase.dev"
  //     }
  //   );
  // })
  // .on("cycle", function(event: any) {
  //   console.log(String(event.target));
  // }).on("complete", function() {
  //   //@ts-ignore
  //   console.log("Fastest is " + this.filter("fastest").map("name"));
  // }).run({ "async": true });