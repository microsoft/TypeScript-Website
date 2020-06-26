// Unknown

// Unknown is one of those types that once it clicks, you
// can find quite a lot of uses for it. It acts like a sibling
// to the any type. Where any allows for ambiguity - unknown
// requires specifics.

// A good example would be in wrapping a JSON parser. JSON
// data can come in many different forms and the creator
// of the json parsing function won't know the shape of the
// data - the person calling that function should.

const jsonParser = (jsonString: string) => JSON.parse(jsonString);

const myAccount = jsonParser(`{ "name": "Dorothea" }`);

myAccount.name;
myAccount.email;

// If you hover on jsonParser, you can see that it has the
// return type of any, so then does myAccount. It's possible
// to fix this with Generics - but it's also possible to fix
// this with unknown.

const jsonParserUnknown = (jsonString: string): unknown => JSON.parse(jsonString);

const myOtherAccount = jsonParserUnknown(`{ "name": "Samuel" }`);

myOtherAccount.name;

// The object myOtherAccount cannot be used until the type has
// been declared to TypeScript. This can be used to ensure
// that API consumers think about their typing up-front:

type User = { name: string };
const myUserAccount = jsonParserUnknown(`{ "name": "Samuel" }`) as User;
myUserAccount.name;

// Unknown is a great tool, to understand it more read these:
// https://mariusschulz.com/blog/the-unknown-type-in-typescript
// https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-0.html#new-unknown-top-type

// Never

// Because TypeScript supports code flow analysis, the language
// needs to be able to represent when code logically cannot
// happen. For example, this function cannot return:

const neverReturns = () => {
  // If it throws on the first line
  throw new Error("Always throws, never returns");
};

// If you hover on the type, you see it is a () => never
// which means it should never happen. These can still be
// passed around like other values:

const myValue = neverReturns();

// Having a function never return can be useful when dealing
// with the unpredictability of the JavaScript runtime and
// API consumers that might not be using types:

const validateUser = (user: User) => {
  if (user) {
    return user.name !== "NaN";
  }

  // According to the type system, this code path can never
  // happen, which matches the return type of neverReturns.

  return neverReturns();
};

// The type definitions state that a user has to be passed in
// but there are enough escape valves in JavaScript whereby
// you can't guarantee that.

// Using a function which returns never allows you to add
// additional code in places which should not be possible.
// This is useful for presenting better error messages,
// or closing resources like files or loops.

// A very popular use for never, is to ensure that a
// switch is exhaustive. E.g., that every path is covered.

// Here's an enum and an exhaustive switch, try adding
// a new option to the enum (maybe Tulip?)

enum Flower {
  Rose,
  Rhododendron,
  Violet,
  Daisy,
}

const flowerLatinName = (flower: Flower) => {
  switch (flower) {
    case Flower.Rose:
      return "Rosa rubiginosa";
    case Flower.Rhododendron:
      return "Rhododendron ferrugineum";
    case Flower.Violet:
      return "Viola reichenbachiana";
    case Flower.Daisy:
      return "Bellis perennis";

    default:
      const _exhaustiveCheck: never = flower;
      return _exhaustiveCheck;
  }
};

// You will get a compiler error saying that your new
// flower type cannot be converted into never.

// Never in Unions

// A never is something which is automatically removed from
// a type union.

type NeverIsRemoved = string | never | number;

// If you look at the type for NeverIsRemoved, you see that
// it is string | number. This is because it should never
// happen at runtime because you cannot assign to it.

// This feature is used a lot in example:conditional-types
