//// { compiler: { ts: "4.0.2" } }

// In 4.0 the JSDoc tag @deprecated is added to the
// type system. You can use @deprecated anywhere
// you can use JSDoc currently.

interface AccountInfo {
  name: string;
  gender: string;

  /** @deprecated use gender field instead */
  sex: "male" | "female";
}

declare const userInfo: AccountInfo;
userInfo.sex;

// TypeScript will offer a non-blocking warning when a
// deprecated property is accessed, and editors like
// vscode will use show the deprecated info in places
// like intellisense, outlines and in your code.
