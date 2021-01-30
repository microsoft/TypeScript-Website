//// { compiler: {  noImplicitAny: false }, order: 2 }

// TypeScript 3.7 버전에 있는 '사용 빈도 수에 따른(infer from usage)' 코드 수정은 
// 더욱 똑똑해졌습니다. 이제부터는 알려진 중요한 
// 타입(문자열, 숫자, 배열, 프로미스)의 리스트로 사용되며, 
// 이러한 객체의 API와 일치하는 타입의 사용에 따라
// 유추합니다. 

// 다음과 같은 예시에서, 함수의 매개변수를 선택하고
// 전구를 클릭하여, "Infer Parameter types..."를 
// 선택합니다.

// 숫자 배열을 유추합니다:

function pushNumber(arr) {
  arr.push(12);
}

// 프로미스를 유추합니다:

function awaitPromise(promise) {
  promise.then((value) => console.log(value));
}

// 함수를 유추하고, 다음은 반환 타입입니다:

function inferAny(app) {
  const result = app.use("hi");
  return result;
}

// 문자열이 추가 되었음으로, 
// 문자열 배열로 유추합니다:

function insertString(names) {
  names[1] = "hello";
}
