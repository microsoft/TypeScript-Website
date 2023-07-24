//// { "order": 3 }

// Deno is a work-in-progress JavaScript and TypeScript
// runtime based on v8 with a focus on security.

// https://deno.land

// Deno has a sandbox-based permissions system which reduces the
// access JavaScript has to the file-system or the network and uses
// http based imports which are downloaded and cached locally.

// Here is an example of using deno for scripting:

import compose from "https://deno.land/x/denofun/lib/compose.ts";

function greet(name: string) {
  return `Hello, ${name}!`;
}

function makeLoud(x: string) {
  return x.toUpperCase();
}

const greetLoudly = compose(makeLoud, greet);

// Echos "HELLO, WORLD!."
greetLoudly("world");

import concat from "https://deno.land/x/denofun/lib/concat.ts";

// Returns "helloworld"
concat("hello", "world");
