---
display: "严格空检查"
oneline: "在类型检查时考虑 `null` 和 `undefined`。"
---

当 `strictNullChecks` 为 `false`，`null` 和 `undefined` 实际上被语言忽略。
这可能导致运行时出现意外的错误。

当 `strictNullChecks` 为 `true`， `null` 和 `undefined` 将有自己的不同的类型。如果你试图在预期的具体值中使用它们，你将会得到一个类型错误。

例如，在这段 TypeScript 代码中，不能确保 `users.find` 真的可以找到一个 `user`。
但是你可以把代码写得好像它一定可以找到一样：

```ts twoslash
// @strictNullChecks: false
// @target: ES2015
declare const loggedInUsername: string;

const users = [
  { name: "Oby", age: 12 },
  { name: "Heera", age: 32 },
];

const loggedInUser = users.find((u) => u.name === loggedInUsername);
console.log(loggedInUser.age);
```

将 `strictNullChecks` 设置为 `true` 将会抛出一个错误，即你在尝试使用 `loggedInUser` 之前没有确保它存在。

```ts twoslash
// @errors: 2339 2532
// @target: ES2020
// @strictNullChecks
declare const loggedInUsername: string;

const users = [
  { name: "Oby", age: 12 },
  { name: "Heera", age: 32 },
];

const loggedInUser = users.find((u) => u.name === loggedInUsername);
console.log(loggedInUser.age);
```

第二个例子失败了，因为 `array` 的 `find` 可以被看作类似如下简化形式：

```ts
// 当 strictNullChecks: true
type Array = {
  find(predicate: (value: any, index: number) => boolean): S | undefined;
};

// 当 strictNullChecks: false undefined 被从类型系统中删除，
// 这将会允许你写出假设总是可以找到结果的代码。
type Array = {
  find(predicate: (value: any, index: number) => boolean): S;
};
```
