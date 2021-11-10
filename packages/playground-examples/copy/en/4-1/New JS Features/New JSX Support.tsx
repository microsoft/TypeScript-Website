//// { "compiler": { "ts": "4.1.0-dev.20201028", "jsx": 4 } }

// In version 17, the React team introduced a new format
// for the JavaScript emitted by JSX transforms. You
// can see the JavaScript in the right hand side of
// the playground in the ".JS" tab  ->

import { useState } from "react";

export function ExampleApp() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>You clicked {count} times </p>
      <button onClick={() => setCount(count + 1)}> Click me </button>
    </div>
  );
}

// The some of the main changes:
//
// - Use an `import` to provide functions instead of a React identifier
// - Different functions for a single element (jsx) vs many children (jsxs)
// - Key is separate from the props
//
// You can read the RFC which this change implements here
// https://github.com/reactjs/rfcs/blob/createlement-rfc/text/0000-create-element-changes.md

// These changes are mostly under-the-hood changes
// which shouldn't affect you you write JSX code as
// an end user.
