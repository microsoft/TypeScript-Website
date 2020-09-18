//// { compiler: {  target: 99 }, order: 1 }

// JavaScript에서 표현할 수 있는 숫자의 크기에 
// 제한이 있다는 걸 알고 계셨나요?

const maxHighValue = 9007199254740991;
const maxLowValue = -9007199254740991;

// 아래 숫자보다 수가 하나라도 더 크거나 작으면
// 매우 위험해집니다

const oneOverMax = 9007199254740992;
const oneBelowMin = -9007199254740992;

// 이 크기의 수치를 다루는 방법은
// numbers 대신 BigInts로 
// 변환하는 것입니다:
//
// https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/BigInt

// TypeScript는 이제 JavaScript에 타입이
// BigInt 여야 한다는 것을 알리는 접미사 "n"을 추가하여
// 2^52(양수/음수) 이상의 숫자 리터럴에 대한
// 기능을 제공합니다.

// 숫자 리터럴
9007199254740993;
-9007199254740993;
9007199254740994;
-9007199254740994;

// 16진수
0x19999999999999;
-0x19999999999999;
0x20000000000000;
-0x20000000000000;
0x20000000000001;
-0x20000000000001;
