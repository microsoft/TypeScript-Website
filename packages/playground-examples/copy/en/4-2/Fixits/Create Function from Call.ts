//// { "compiler": { "ts": "4.2.0-beta" } }
// In 4.2 a community member (@a-tarasyuk) added the ability to generate functions
// from calls which aren't defined. For example if you select all the code on line 5,
// then click "Quick Fix", you will see the option to have the missing function generated.

const id = generateUUID();

// The fixit will take into account contextual information like the potential
// return type for the function. For example, TypeScript knows the return type
// because it is annotated at the variable declaration.

const idStr: string = generateUUID1();

// The fixit will keep the same number of generics arguments when they are used:

const idObj = generateUUID3<{ id: string }>();

// Parameters also act as you would expect:

const complexUUID = generateUUID4("SHA32", 5, { namespace: "typescriptlang.org" });

// It's not possible to show in the playground, but the codefix can create stubbed
// functions across different modules too - lots to use.
