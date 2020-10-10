//// { order: 1, target: "es5" }

// 모던 JavaScript는 특별한 구문의
// 프로미스(Promise) 기반 API를 추가하여
// 비동기 코드가 동기적으로 작동하는 것처럼
// 콜백을 처리하는 방법을 추가했습니다.

// 모든 언어 기능과 마찬가지로,
// 이러한 방식은 복잡성이 증가하는 대신 효율성이 증가합니다.
// 함수를 async로 만드는 것은 반환값을 프로미스 형태로 감싸주는 것을 의미합니다.
// 기존에는 string을 반환했지만 이제 Promise<string>을 반환합니다.

const func = () => ":wave:";
const asyncFunc = async () => ":wave:";

const myString = func();
const myPromiseString = asyncFunc();

myString.length;

// myPromiseString은 string이 아닌 프로미스 입니다:

myPromiseString.length;

// await 키워드를 사용하면
// 프로미스를 내부의 값으로 변환할 수 있습니다.
// 현재 이러한 기능은 async 함수 내에서만 작동합니다.

const myWrapperFunction = async () => {
  const myString = func();
  const myResolvedPromiseString = await asyncFunc();

  // await 키워드를 통해
  // 이제 myResolvedPromiseString 값은 문자열입니다.
  myString.length;
  myResolvedPromiseString.length;
};

// await을 통해 실행되는 코드는 오류 객체를 발생시킬 수 있고,
// 이러한 오류를 잡아내는 것이 중요합니다.

const myThrowingFunction = async () => {
  throw new Error("Do not call this");
};

// async 함수를 try catch 문으로 감싸
// 함수가 예기치 않게 작동하는 경우를 처리합니다.

const asyncFunctionCatching = async () => {
  const myReturnValue = "Hello world";
  try {
    await myThrowingFunction();
  } catch (error) {
    console.error("myThrowingFunction failed", error);
  }
  return myReturnValue;
};

// 단일 값을 반환하거나 오류를 발생시키는
// API의 인간 공학적 특성 때문에,
// 반환 값 내부의 결괏값에 대한 정보 제공을 고려해야 하며,
// 실제 예외적인 상황이 발생했을 때만
// throw 문을 사용해야 합니다.

const exampleSquareRootFunction = async (input: any) => {
  if (isNaN(input)) {
    throw new Error("Only numbers are accepted");
  }

  if (input < 0) {
    return { success: false, message: "Cannot square root negative number" };
  } else {
    return { success: true, value: Math.sqrt(input) };
  }
};

// 그런 다음 해당 비동기 함수를 받는 객체로 응답 상태를 확인하고
// 반환 값으로 무엇을 처리할지 알아냅니다.
// 이것은 사소한 예제지만, 네트워킹에 관련된 코드를 작성한다면
// 이러한 API는 구문을 추가할만한 가치가 있습니다.

const checkSquareRoot = async (value: number) => {
  const response = await exampleSquareRootFunction(value);
  if (response.success) {
    response.value;
  }
};

// Async/Await 구문은 다음과 같은 코드를 사용해왔습니다:

// getResponse(url, (response) => {
//   getResponse(response.url, (secondResponse) => {
//     const responseData = secondResponse.data
//     getResponse(responseData.url, (thirdResponse) => {
//       ...
//     })
//   })
// })

// 이를 순차적으로 작성하면:

// const response = await getResponse(url)
// const secondResponse = await getResponse(response.url)
// const responseData = secondResponse.data
// const thirdResponse = await getResponse(responseData.url)
// ...

// 코드가 왼쪽 가장자리에 가깝게 배치되어,
// 코드가 일관된 리듬으로 읽힐 수 있습니다.
