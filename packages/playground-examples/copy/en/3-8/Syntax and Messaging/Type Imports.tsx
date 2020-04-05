//// { compiler: { ts: "3.8.3" } }
// In 3.8 we added new syntax for importing types, which
// would be similar to users who have come from flow.

// 'import type' provides a way to declare a type only import
// which means you can be sure that the code will erased when
// converting to JavaScript in a very predictable way because
// it will always be removed!

// For example, this line will never add an import or require
import type { CSSProperties } from 'react';

// Which is used here as a type
const style: CSSProperties = {
  textAlign: 'center'
};

// This is in contrast to this import:
import * as React from 'react';

// Which will be included in the JavaScript
export class Welcome extends React.Component {
  render() {
    return (
      <div style={style}>
        <h1>Hello, world</h1>
      </div>
    )
  }
}

// However, if the 'import' without types, only imports
// types - it could also be removed. If you look in the
// compiled JS output, this import is not included

import { FunctionComponent } from 'react';

export const BetaNotice: FunctionComponent = () => {
  return <p>This page is still in beta</p>
}

// This is called import elision, and it can be the source
// of confusion. The syntax 'import type' allows you to be
// specific about what you want in JavaScript.

// This is a small overview for one of the main use cases
// for 'import types' but there are more which you can read
// in the 3.8 release notes

// https://devblogs.microsoft.com/typescript/announcing-typescript-3-8-beta/#type-only-imports-exports
