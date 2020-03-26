//// { compiler: {  }, order: 2 }

// The nullish coalescing operator is an alternative to ||
// which returns the right-side expression if the left-side
// is null or undefined.

// In contrast, || uses falsy checks, meaning an empty
// string or the number 0 would be considered false.

// A good example for this feature is dealing with partial
// objects which have defaults when a key isn't passed in.

interface AppConfiguration {
  // Default: "(no name)"; empty string IS valid
  name: string;

  // Default: -1; 0 is valid
  items: number;

  // Default: true
  active: boolean;
}

function updateApp(config: Partial<AppConfiguration>) {
  // With null-coalescing operator
  config.name = config.name ?? "(no name)";
  config.items = config.items ?? -1;
  config.active = config.active ?? true;

  // Current solution
  config.name = typeof config.name === "string" ? config.name : "(no name)";
  config.items = typeof config.items === "number" ? config.items : -1;
  config.active = typeof config.active === "boolean" ? config.active : true;

  // Using || operator which could give bad data
  config.name = config.name || "(no name)"; // does not allow for "" input
  config.items = config.items || -1; // does not allow for 0 input
  config.active = config.active || true; // really bad, always true
}

// You can read more about nullish coalescing in the 3.7 blog post:
//
// https://devblogs.microsoft.com/typescript/announcing-typescript-3-7/
