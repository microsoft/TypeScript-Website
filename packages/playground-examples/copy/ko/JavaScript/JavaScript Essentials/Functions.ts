//// { order: 2, compiler: { noImplicitAny: false } }

// JavaScript에서 함수를 선언하는 방식에는
// 여러 가지가 있습니다. 두 숫자를 더하는
// 함수를 한번 살펴보겠습니다:

// 전역 스코프에 addOldSchool라는 이름으로 함수를 생성합니다
function addOldSchool(x, y) {
  return x + y;
}

// 또한 함수의 이름을 변수로
// 옮길 수 있습니다
const anonymousOldSchoolFunction = function (x, y) {
  return x + y;
};

// 함수 선언에 화살표 함수 또한 사용할 수 있습니다
const addFunction = (x, y) => {
  return x + y;
};

// 우리는 마지막 방식에 초점을 맞추겠습니다.
// 하지만 세 가지 방식에 똑같이 적용됩니다.

// TypeScript는 함수 정의에
// 추가 구문을 제공하고 해당 함수에서
// 예상되는 타입에 대한 힌트를 제공합니다.
//
// 다음은 add 함수의 가장 열려있는 버전으로,
// add 함수는 any 타입의 두 개의 입력을 받습니다: 이것은
// 문자열, 숫자 또는 객체가 될 수 있습니다.

const add1 = (x: any, y: any) => {
  return x + y;
};
add1("Hello", 23);

// JavaScript에서는 타당하지만 (예시와 같이 문자열도
// 더해질 수 있습니다) 우리가 의도한 숫자를 더하는
// 함수와는 맞지 않으므로, 우리는 x와 y를 숫자만
// 허용하게 변환합니다.

const add2 = (x: number, y: number) => {
  return x + y;
};
add2(16, 23);
add2("Hello", 23);

// 좋습니다. 이제 숫자 이외의 값이 전달되면 에러가
// 발생합니다. 만약 add2 단어 위로 마우스를 가져가면
// TypeScript가 다음과 같이 설명하는 것을 볼 수 있습니다.
//
//   const add2: (x: number, y: number) => number
//
// 두 입력이 number일 때 가능한 반환 유형은 오로지
// number라고 추론합니다. 훌륭합니다. 이것은 추가 구문을
// 작성할 필요가 없게 해줍니다.
// 이를 수행하는 데 필요한 사항을 살펴보겠습니다:

const add3 = (x: number, y: number): string => {
  return x + y;
};

// 이 함수는 에러를 발생시킵니다. 왜냐하면 TypeScript는
// string 값이 반환되는 것으로 알고 있지만 함수는
// 그 약속을 지키지 못했기 때문입니다.

const add4 = (x: number, y: number): number => {
  return x + y;
};

// 이것은 add2의 매우 명시적인 버전입니다
// - 시작 하기 전에 자신에게 작업공간을 제공하기
// 위해 명시적인 반환 타입 구문을 사용하는 경우가
// 있습니다. 테스트 기반 개발에서 실패한 테스트로
// 시작하는 것이 권장되는 방식과 비슷하지만, 이 경우에는
// 대신 실패한 함수 형태가 있습니다.

// 이 예제는 입문서일 뿐입니다. 핸드북과 다음 예시의
// Functional JavaScript 섹션 내에서 TypeScript의 함수가
// 어떻게 작동하는지에 대한 더 많은 것들을 배울 수 있습니다:
//
// https://www.typescriptlang.org/docs/handbook/functions.html
// example:function-chaining

// 그리고 JavaScript 필수 사항을 계속 살펴보기 위해,
// 코드 흐름이 TypeScript 유형에 어떤 영향을 미치는지 살펴보겠습니다:
// example:code-flow
