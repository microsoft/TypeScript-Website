---
display: "Declaration"
oneline: "Generates .d.ts files from TypeScript and JavaScript files in your project."
---

프로젝트 내의 모든 TypeScript나 JavaScript 파일에 대한  `.d.ts`파일을 생성합니다. 
이러한  `.d.ts`파일은 모듈의 외부 API를 설명하는 타입 정의 파일입니다. 
`.d.ts` 파일 사용하면, TypeScript와 같은 도구로 intellisense와 타입이 정해지지 않은 코드의 정확한 타입을 제공할 수 있습니다.

`declaration`이 `true`로 설정되면, 아래와 같은 TypeScript 코드로 컴파일러를 실행합니다:

```ts twoslash
export let helloWorld = "hi";
```

아래와 같은`index.js`파일이 생성될 것입니다:

```ts twoslash
// @showEmit
export let helloWorld = "hi";
```

해당 `helloWorld.d.ts`:

```ts twoslash
// @showEmittedFile: index.d.ts
// @showEmit
// @declaration
export let helloWorld = "hi";
```

JavaScript 파일 용 `.d.ts`파일로 작업할 때,  [`emitDeclarationOnly`](#emitDeclarationOnly)를 사용하거나  [`outDir`](#outDir)를 사용하여 JavaScript 파일이 덮어써지지 않도록 할 수 있습니다.
