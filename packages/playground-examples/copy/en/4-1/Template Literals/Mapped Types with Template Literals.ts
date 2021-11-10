//// { "compiler": { "ts": "4.1.0-dev.20201028" } }

// TypeScript 4.1 added support for template literals, you can
// understand some of the basics in example:intro-to-template-literals

// 4.1 introduces new syntax inside a mapped types declaration,
// you can now use "as `templated string`" which can be used to transform
// strings inside a union.

// For example, this type will transform all of the properties of an existing
// type into four functions which correspond to traditional REST calls.

// Template strings literals to describe each API endpoint:
type GET<T extends string> = `get${Capitalize<T>}`
type POST<T extends string> = `post${Capitalize<T>}`
type PUT<T extends string> = `put${Capitalize<T>}`
type DELETE<T extends string> = `delete${Capitalize<T>}`

// A union of the above literal types
type REST<T extends string> = GET<T> | POST<T> | PUT<T> | DELETE<T>

// Takes a type, then for each string property in the type, map
// that key to REST above, which would create the four functions.

type RESTify<Type> = {
  [Key in keyof Type as REST<Key extends string ? Key : never>]: () => Type[Key]
};

// The `Key extends string ? Key : never` is needed because an object
// can contain strings, numbers and symbols as keys. We can only handle
// the string cases here.

// Now we have a list of objects available through the API:

interface APIs {
  artwork: { id: string, title: string };
  artist: { id: string, name: string };
  location: { id: string, address: string, country: string }
}

// Then when we have an object which uses these types
declare const api: RESTify<APIs>

// Then all these functions are automatically created 
api.getArtist()
api.postArtist()
api.putLocation()

// Continue learning more about template literals in:
// example:string-manipulation-with-template-literals

// Or read the announcement blog post:
// https://devblogs.microsoft.com/typescript/announcing-typescript-4-1-beta/#template-literal-types

