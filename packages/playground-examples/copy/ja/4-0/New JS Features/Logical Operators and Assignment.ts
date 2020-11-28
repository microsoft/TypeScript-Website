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

// There are three new operators: 
//
//   ||= shown above
//   &&= which uses 'and' logic instead of 'or'
//   ??= which builds on example:nullish-coalescing to offer a stricter
//       version of || which uses === instead

// For more info on the proposal, see:
// https://github.com/tc39/proposal-logical-assignment
