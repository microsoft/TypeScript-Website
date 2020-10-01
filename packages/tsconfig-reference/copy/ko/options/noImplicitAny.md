---
display: "No Implicit Any"
oneline: "Avoid introducing anys inside your codebase when a type could be specified"
---

타입 표기가 존재하지 않는 경우에 대해서, TypeScript는 타입을 추론할 수 없을 때 해당 변수의 타입을 `any`로 대체합니다.

이것으로 인해 일부 오류가 누락될 수 있습니다. 예를 들면:

```ts twoslash
// @noImplicitAny: false
function fn(s) {
  // No error?
  console.log(s.subtr(3));
}
fn(42);
```

그러나 `noImplicitAny`를 켜면 TypeScript는 `any`를 추론 할 때마다 오류를 발생시킵니다:

```ts twoslash
// @errors: 7006
function fn(s) {
  console.log(s.subtr(3));
}
```
