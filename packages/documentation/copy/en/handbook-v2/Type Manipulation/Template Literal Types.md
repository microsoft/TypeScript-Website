---
title: 模板字面类型
layout: docs
permalink: /zh/docs/handbook/2/template-literal-types.html
oneline: "通过模板字面字符串生成修改属性的映射类型。"
---

模板字面类型是基于[字符串字面类型](/zh/docs/handbook/2/everyday-types.html#literal-types)的基础上构建的，可以通过联合类型展开为多个字符串。

它们与 JavaScript 中的[模板字面字符串](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Template_literals)具有相同的语法，但前者在类型位置使用。当与具体的字面类型一起使用时，模板字面可以通过拼接内容生成新的字符串字面类型。

```ts twoslash
type World = "world";

type Greeting = `hello ${World}`;
//   ^?
```

当联合类型被用于插值位置时，类型是由每个联合成员可能表示的所有字符串字面类型的集合：

```ts twoslash
type EmailLocaleIDs = "welcome_email" | "email_heading";
type FooterLocaleIDs = "footer_title" | "footer_sendoff";

type AllLocaleIDs = `${EmailLocaleIDs | FooterLocaleIDs}_id`;
//   ^?
```

对于模板字面中的每个插值位置，联合类型会进行交叉乘积：

```ts twoslash
type EmailLocaleIDs = "welcome_email" | "email_heading";
type FooterLocaleIDs = "footer_title" | "footer_sendoff";
// ---cut---
type AllLocaleIDs = `${EmailLocaleIDs | FooterLocaleIDs}_id`;
type Lang = "en" | "ja" | "pt";

type LocaleMessageIDs = `${Lang}_${AllLocaleIDs}`;
//   ^?
```

通常建议在大量字符串联合的情况下预先生成，但在较小规模的情况下，这种方式很有用。

### 类型中的字符串联合

模板字面类型的威力在于可以基于类型内的信息定义新的字符串。

假设有一个函数（`makeWatchedObject`），它向传入的对象添加一个名为 `on()` 的新函数。在 JavaScript 中，调用可能如下所示：`makeWatchedObject(baseObject)`。我们可以将基本对象想象为如下所示：

```ts twoslash
// @noErrors
const passedObject = {
  firstName: "Saoirse",
  lastName: "Ronan",
  age: 26,
};
```

将被添加到基本对象的 `on` 函数有两个实参，一个是 `eventName`（一个 `string`），另一个是 `callback`（一个 `function`）。

`eventName` 的形式应为 `传入对象的属性名称 + "Changed"`；因此，从基本对象的属性 `firstName` 衍生的事件名应为 `firstNameChanged`。

当调用 `callback` 函数时：
  * 应传递一个类型与名为 `传入对象的属性名称` 的属性关联的值；因此，由于 `firstName` 类型为 `string`，`firstNameChanged` 事件的回调函数期望在调用时传递一个 `string`。
  * 应具有 `void` 的返回类型（这里为了简化演示）

因此，`on()` 的函数签名可能是这样的：`on(eventName: string, callback: (newValue: any) => void)`。然而，在前面的描述中，我们确定了我们希望在代码中记录的重要类型约束。模板字面类型让我们能够将这些约束带入我们的代码中。

```ts twoslash
// @noErrors
declare function makeWatchedObject(obj: any): any;
// ---cut---
const person = makeWatchedObject({
  firstName: "Saoirse",
  lastName: "Ronan",
  age: 26,
});

// makeWatchedObject 已经向匿名对象添加了 `on` 方法

person.on("firstNameChanged", (newValue) => {
  console.log(`firstName 已更改为 ${newValue}！`);
});
```

注意，`on` 监听的事件是 `"firstNameChanged"`，而不仅仅是 `"firstName"`。如果我们能确保符合属性名集合与末尾添加“Changed”的并集的约束，我们可以使 `on()` 的规范更加强大。虽然我们在 JavaScript 中可以轻松进行这样的计算，即 ``Object.keys(passedObject).map(x => `${x}Changed`)``，但是*在类型系统中*，模板字面类型提供了类似的字符串处理方法：

```ts twoslash
type PropEventSource<Type> = {
    on(eventName: `${string & keyof Type}Changed`, callback: (newValue: any) => void): void;
};

/// 创建一个带有 `on` 方法的“被监视对象”，以便你可以监视属性的更改。
declare function makeWatchedObject<Type>(obj: Type): Type & PropEventSource<Type>;
```

有了这个，我们可以构建一个在给定错误属性时报错的结构：

```ts twoslash
// @errors: 2345
type PropEventSource<Type> = {
    on(eventName: `${string & keyof Type}Changed`, callback: (newValue: any) => void): void;
};

declare function makeWatchedObject<T>(obj: T): T & PropEventSource<T>;
// ---cut---
const person = makeWatchedObject({
  firstName: "Saoirse",
  lastName: "Ronan",
  age: 26
});

person.on("firstNameChanged", () => {});

// 防止易发生人为错误（使用键而不是事件名）
person.on("firstName", () => {});

// 它具有防错功能
person.on("frstNameChanged", () => {});
```

### 使用模板字面类型进行类型推断

请注意，我们没有充分利用原始传入对象中提供的所有信息。对于 `firstName` 的更改（即 `firstNameChanged` 事件），我们应该期望回调函数接收一个 `string` 类型的参数。类似地，对于 `age` 的更改，回调函数应该接收一个 `number` 类型的参数。我们在类型推断中简单地使用了 `any` 来给 `callback` 的参数加上类型。再次强调，模板字面类型使得我们可以确保属性的数据类型与该属性的回调函数的第一个参数具有相同的类型。

使这成为可能的关键是：我们可以使用具有泛型的函数，使得：

1. 在第一个实参中使用的字面量被捕获为字面类型
2. 可以验证该字面类型是否属于泛型中有效属性的联合类型
3. 可以使用索引访问来查找泛型结构中验证属性的类型
4. 然后，可以应用这些类型信息来确保回调函数的实参是与之相同的类型


```ts twoslash
type PropEventSource<Type> = {
    on<Key extends string & keyof Type>
        (eventName: `${Key}Changed`, callback: (newValue: Type[Key]) => void): void;
};

declare function makeWatchedObject<Type>(obj: Type): Type & PropEventSource<Type>;

const person = makeWatchedObject({
  firstName: "Saoirse",
  lastName: "Ronan",
  age: 26
});

person.on("firstNameChanged", newName => {
    //                        ^?
    console.log(`新姓名为 ${newName.toUpperCase()}`);
});

person.on("ageChanged", newAge => {
    //                  ^?
    if (newAge < 0) {
        console.warn("警告！年龄为负数");
    }
})
```

在这里，我们将 `on` 方法转换为一个泛型方法。

当用户使用字符串 `"firstNameChanged"` 调用时，TypeScript 将尝试为 `Key` 推断正确的类型。为了做到这一点，它将 `Key` 与 `"Changed"` 之前的内容进行匹配，并推断出字符串 `"firstName"`。一旦 TypeScript 弄清楚了这一点，`on` 方法就可以获取原始对象上 `firstName` 的类型，在本例中为 `string`。类似地，当使用 `"ageChanged"` 调用时，TypeScript 找到属性 `age` 的类型，即 `number`。

推断可以以不同的方式组合，通常用于解构字符串，并以不同的方式重新构建它们。

## 内置字符串操作类型

为了帮助进行字符串操作，TypeScript 包含了一组可用于字符串操作的类型。这些类型是内置到编译器中的，用于提高性能，不能在 TypeScript 附带的 `.d.ts` 文件中找到。

### `Uppercase<StringType>`

将字符串中的每个字符转换为大写形式。

##### 示例

```ts twoslash
type Greeting = "Hello, world"
type ShoutyGreeting = Uppercase<Greeting>
//   ^?

type ASCIICacheKey<Str extends string> = `ID-${Uppercase<Str>}`
type MainID = ASCIICacheKey<"my_app">
//   ^?
```

### `Lowercase<StringType>`

将字符串中的每个字符转换为小写形式。

##### 示例

```ts twoslash
type Greeting = "Hello, world"
type QuietGreeting = Lowercase<Greeting>
//   ^?

type ASCIICacheKey<Str extends string> = `id-${Lowercase<Str>}`
type MainID = ASCIICacheKey<"MY_APP">
//   ^?
```

### `Capitalize<StringType>`

将字符串中的第一个字符转换为大写形式。

##### 示例

```ts twoslash
type LowercaseGreeting = "hello, world";
type Greeting = Capitalize<LowercaseGreeting>;
//   ^?
```

### `Uncapitalize<StringType>`

将字符串中的第一个字符转换为小写形式。

##### 示例

```ts twoslash
type UppercaseGreeting = "HELLO WORLD";
type UncomfortableGreeting = Uncapitalize<UppercaseGreeting>;
//   ^?
```

<details>
    <summary>关于内置字符串操作类型的技术细节</summary>
    <p>截至 TypeScript 4.1 版本，这些内置函数的代码直接使用 JavaScript 的字符串运行时函数进行操作，不考虑区域设置。</p>
    <code><pre>
function applyStringMapping(symbol: Symbol, str: string) {
    switch (intrinsicTypeKinds.get(symbol.escapedName as string)) {
        case IntrinsicTypeKind.Uppercase: return str.toUpperCase();
        case IntrinsicTypeKind.Lowercase: return str.toLowerCase();
        case IntrinsicTypeKind.Capitalize: return str.charAt(0).toUpperCase() + str.slice(1);
        case IntrinsicTypeKind.Uncapitalize: return str.charAt(0).toLowerCase() + str.slice(1);
    }
    return str;
}</pre></code>
</details>
