//// { compiler: { ts: "4.0.0-beta" } }

// Logical Operators and Assignment are new features in
// JavaScript for 2020. These are a suite of new operators
// which edit a JavaScript object.

// Their goal is to re-use the concept of mathematical 
// operators (e.g. += -= *=) but with logic instead.

interface User {
  id?: number
  name: string
  location: {
      postalCode?: string
  }
}

function updateUser(user: User) {
  // This code can be replaced 
  if (!user.id) user.id = 1

  // Or this code:
  user.id = user.id || 1

  // With this code:
  user.id ||= 1
}

// The suites of operators can handle deeply nesting, which 
// can save on quite a lot of boilerplate code too.

declare const user: User
user.location.postalCode ||= "90210"

// The logical assignment operators also won't accidentally
// trigger a setter, in comparison to the long form version:

user.location.postalCode = user.location.postalCode || "90210"
//                         ^ this could trigger a setter as a part
//                           of checking

// If setters are new to you, you can read more at MDN:
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/set 

// There are three new operators: 
//
//   ||= shown above
//   &&= which uses 'and' logic instead of 'or'
//   ??= which builds on example:nullish-coalescing to offer a stricter
//       version of || which uses === instead

// For more info on the proposal, see:
// https://github.com/tc39/proposal-logical-assignment
