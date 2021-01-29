//// { compiler: { ts: "4.0.2" } }

// JavaScript는 어떠한 값도 전달할 수 있기 때문에,
// TypeScript는 에러의 타입 선언을 지원하지 않습니다

try {
  // ..
} catch (e) {}

// 역사적으로, catch문의 `e`는 기본적으로
// any 타입으로 설정되는 것을 의미합니다.
// 그래서 어떠한 프로퍼티 접근도 마음대로 접근할 수 있는 자유를 허용했었습니다.
// 4.0에서는, `any`와 `unknown` 모두 허용하기 위해
// catch 절에서 타입 할당의 제한을 완화했습니다.

// any 타입으로 동일한 동작
try {
  // ..
} catch (e) {
  e.stack;
}

// unknown 타입으로 명확한 동작:

try {
  // ..
} catch (e: unknown) {
  // 타입 시스템이 `e`에 대해 알기 전까진 사용할 수 없습니다. 
  // 더 많은 정보 살펴보세요:
  // 예시:unknown-and-never
  e.stack;

  if (e instanceof SyntaxError) {
    e.stack;
  }
}
