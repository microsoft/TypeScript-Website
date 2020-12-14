---
title: Utility Types
layout: docs
permalink: /ko/docs/handbook/utility-types.html
oneline: Types which are globally included in TypeScript
translatable: true
---

TypeScript는 일반적인 타입 변환을 쉽게 하기 위해서 몇 가지 유틸리티 타입을 제공합니다. 이러한 유틸리티는 전역으로 사용 가능합니다.

## `Partial<Type>`

`Type` 집합의 모든 프로퍼티를 선택적으로 타입을 생성합니다. 이 유틸리티는 주어진 타입의 모든 하위 타입 집합을 나타내는 타입을 반환합니다.

##### 예제

```ts twoslash
interface Todo {
  title: string;
  description: string;
}

function updateTodo(todo: Todo, fieldsToUpdate: Partial<Todo>) {
  return { ...todo, ...fieldsToUpdate };
}

const todo1 = {
  title: "organize desk",
  description: "clear clutter",
};

const todo2 = updateTodo(todo1, {
  description: "throw out trash",
});
```

## `Readonly<Type>`

 `Type` 집합의 모든 프로퍼티`읽기 전용(readonly)`으로 설정한 타입을 생성합니다, 즉 생성된 타입의 프로퍼티는 재할당될 수 없습니다.

##### 예제

```ts twoslash
// @errors: 2540
interface Todo {
  title: string;
}

const todo: Readonly<Todo> = {
  title: "Delete inactive users",
};

todo.title = "Hello";
```

이 유틸리티는 런타임에 실패할 할당 표현식을 표현할 때 유용합니다(예.  [frozen 객체](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object/freeze) 의 프로퍼티에 재할당하려고 하는 경우).

##### `Object.freeze`

```ts
function freeze<Type>(obj: Type): Readonly<Type>;
```

## `Record<Keys,Type>`

타입 `Type`의 프로퍼티 `키`의 집합으로 타입을 생성합니다. 이 유틸리티는 타입의 프로퍼티를 다른 타입에 매핑 시키는데 사용될 수 있습니다.

##### 예제

```ts twoslash
interface PageInfo {
  title: string;
}

type Page = "home" | "about" | "contact";

const nav: Record<Page, PageInfo> = {
  about: { title: "about" },
  contact: { title: "contact" },
  home: { title: "home" },
};

nav.about;
// ^?
```

## `Pick<Type, Keys>`

`Type`에서 프로퍼티 `Keys`의 집합을 선택해 타입을 생성합니다. 

##### 예제

```ts twoslash
interface Todo {
  title: string;
  description: string;
  completed: boolean;
}

type TodoPreview = Pick<Todo, "title" | "completed">;

const todo: TodoPreview = {
  title: "Clean room",
  completed: false,
};

todo;
// ^?
```

## `Omit<Type, Keys>`

`Type`에서 모든 프로퍼티를 선택하고 `키`를 제거한 타입을 생성합니다.

##### 예제

```ts twoslash
interface Todo {
  title: string;
  description: string;
  completed: boolean;
}

type TodoPreview = Omit<Todo, "description">;

const todo: TodoPreview = {
  title: "Clean room",
  completed: false,
};

todo;
// ^?
```

## `Exclude<Type, ExcludedUnion>`

`ExcludedUnion`에 할당할 수 있는 모든 유니온 멤버를 `Type`에서 제외하여 타입을 생성합니다.

##### 예제

```ts twoslash
type T0 = Exclude<"a" | "b" | "c", "a">;
//    ^?
type T1 = Exclude<"a" | "b" | "c", "a" | "b">;
//    ^?
type T2 = Exclude<string | number | (() => void), Function>;
//    ^?
```

## `Extract<Type, Union>`

`Union`에 할당할 수 있는 모든 유니온 멤버를 `Type`에서 가져와서 타입을 생성합니다.

##### 예제

```ts twoslash
type T0 = Extract<"a" | "b" | "c", "a" | "f">;
//    ^?
type T1 = Extract<string | number | (() => void), Function>;
//    ^?
```

## `NonNullable<Type>`

`Type`에서 `null`과 `정의되지 않은 것(undefined)`을 제외하고 타입을 생성합니다.

##### 예제

```ts twoslash
type T0 = NonNullable<string | number | undefined>;
//    ^?
type T1 = NonNullable<string[] | null | undefined>;
//    ^?
```

## `Parameters<Type>`

함수 타입 `Type`의 매개변수에 사용된 타입에서 튜플 타입을 생성합니다.

##### 예제

```ts twoslash
// @errors: 2344
declare function f1(arg: { a: number; b: string }): void;

type T0 = Parameters<() => string>;
//    ^?
type T1 = Parameters<(s: string) => void>;
//    ^?
type T2 = Parameters<<T>(arg: T) => T>;
//    ^?
type T3 = Parameters<typeof f1>;
//    ^?
type T4 = Parameters<any>;
//    ^?
type T5 = Parameters<never>;
//    ^?
type T6 = Parameters<string>;
//    ^?
type T7 = Parameters<Function>;
//    ^?
```

## `ConstructorParameters<Type>`

생성자 함수 타입의 타입에서 튜플 또는 배열 타입을 생성합니다. 모든 매개변수 타입을 가지는 튜플 타입(또는 `Type`이 함수가 아닌 경우 타입 `never`)을 생성합니다.

##### 예제

```ts twoslash
// @errors: 2344
// @strict: false
type T0 = ConstructorParameters<ErrorConstructor>;
//    ^?
type T1 = ConstructorParameters<FunctionConstructor>;
//    ^?
type T2 = ConstructorParameters<RegExpConstructor>;
//    ^?
type T3 = ConstructorParameters<any>;
//    ^?

type T4 = ConstructorParameters<Function>;
//    ^?
```

## `ReturnType<Type>`

함수 `Type`의 반환 타입으로 구성된 타입을 생성합니다.

##### 예제

```ts twoslash
// @errors: 2344 2344
declare function f1(): { a: number; b: string };

type T0 = ReturnType<() => string>;
//    ^?
type T1 = ReturnType<(s: string) => void>;
//    ^?
type T2 = ReturnType<<T>() => T>;
//    ^?
type T3 = ReturnType<<T extends U, U extends number[]>() => T>;
//    ^?
type T4 = ReturnType<typeof f1>;
//    ^?
type T5 = ReturnType<any>;
//    ^?
type T6 = ReturnType<never>;
//    ^?
type T7 = ReturnType<string>;
//    ^?
type T8 = ReturnType<Function>;
//    ^?
```

## `InstanceType<Type>`

`Type`의 생성자 함수의 인스턴스 타입으로 구성된 타입을 생성합니다.

##### 예제

```ts twoslash
// @errors: 2344 2344
// @strict: false
class C {
  x = 0;
  y = 0;
}

type T0 = InstanceType<typeof C>;
//    ^?
type T1 = InstanceType<any>;
//    ^?
type T2 = InstanceType<never>;
//    ^?
type T3 = InstanceType<string>;
//    ^?
type T4 = InstanceType<Function>;
//    ^?
```

## `Required<Type>`

필요한 `T`집합의 모든 프로퍼티로 구성된 타입을 생성합니다.  [`Partial`](#partialtype) 의 반대쪽.

##### 예제

```ts twoslash
// @errors: 2741
interface Props {
  a?: number;
  b?: string;
}

const obj: Props = { a: 5 };

const obj2: Required<Props> = { a: 5 };
```

## `ThisParameterType<Type>`

함수 타입의 [this](/docs/handbook/functions.html#this-parameters) 매개변수의 타입, 또는 함수 타입에 `this`매개변수가 없을 경우 [unknown](/docs/handbook/release-notes/typescript-3-0.html#new-unknown-top-type) 을 추출합니다.

##### 예제

```ts twoslash
function toHex(this: Number) {
  return this.toString(16);
}

function numberToString(n: ThisParameterType<typeof toHex>) {
  return toHex.apply(n);
}
```

## `OmitThisParameter<Type>`

`Type`에서  [`this`](/docs/handbook/functions.html#this-parameters) 매개변수를 제거합니다. `Type`에 명시적으로 선언된 `this`매개변수가 없는 경우에, 단순히 `Type`입니다. 반면에, `this`매개변수가 없는 새로운 함수 타입은 `Type`에서 생성됩니다. 제네릭은 사라지고 마지막 오버로드 시그니처만 새로운 함수 타입으로 전파됩니다.

##### 예제

```ts twoslash
function toHex(this: Number) {
  return this.toString(16);
}

const fiveToHex: OmitThisParameter<typeof toHex> = toHex.bind(5);

console.log(fiveToHex());
```

## `ThisType<Type>`

이 유틸리티는 변형된 타입을 반환하지 않습니다. 대신에, 문맥적 [`this`](/docs/handbook/functions.html#this) 타입에 표시하는 역할을 합니다. 이 유틸리티를 사용하기 위해서는 `--noImplicitThis` 플래그를 사용해야 하는 것을 기억하세요.

##### 예제

```ts twoslash
// @noImplicitThis: false
type ObjectDescriptor<D, M> = {
  data?: D;
  methods?: M & ThisType<D & M>; // Type of 'this' in methods is D & M
};

function makeObject<D, M>(desc: ObjectDescriptor<D, M>): D & M {
  let data: object = desc.data || {};
  let methods: object = desc.methods || {};
  return { ...data, ...methods } as D & M;
}

let obj = makeObject({
  data: { x: 0, y: 0 },
  methods: {
    moveBy(dx: number, dy: number) {
      this.x += dx; // Strongly typed this
      this.y += dy; // Strongly typed this
    },
  },
});

obj.x = 10;
obj.y = 20;
obj.moveBy(5, 5);
```

위 예제에서, `makeObject`의 인수인 `methods` 객체는 `ThisType<D & M>` 을 포함한 문맥적 타입을 가지고 따라서 `methods` 객체의 메서드 안에 [this](/docs/handbook/functions.html#this) 타입은 `{ x: number, y: number } & { moveBy(dx: number, dy: number): number }`입니다.  `methods` 프로퍼티의 타입은 추론 대상인 동시에 메서드의 `this` 타입의 출처인 것에 주목하세요. 

`ThisType<T>` 마커 인터페이스는 단지  `lib.d.ts`에 선언된 빈 인터페이스입니다. 객체 리터럴의 문맥적 타입으로 인식되는 것을 넘어, 그 인터페이스는 빈 인터페이스처럼 동작합니다.

## 내장 문자열 조작 타입

템플릿 문자열 리터럴 주변의 문자열 조작을 돕기 위해, TypeScript는 타입 시스템 내에서 문자열 조작에 사용할 수 있는 타입 집합이 포함되어 있습니다. 할 수 있어요
