//// { order: 1, target: "es5" }

// Modern JavaScript added a way to handle callbacks in an
// elegant way by adding a Promise based API which has special
// syntax that lets you treat asynchronous code as though it
// acts synchronously.

// Like all language features, this is a trade-off in
// complexity: making a function async means your return
// values are wrapped in Promises. What used to return a
// string, now returns a Promise<string>.

const func = () => ":wave:";
const asyncFunc = async () => ":wave:";

const myString = func();
const myPromiseString = asyncFunc();

myString.length;

// myPromiseString is a Promise, not the string:

myPromiseString.length;

// You can use the await keyword to convert a promise
// into its value. Today, these only work inside an async
// function.

const myWrapperFunction = async () => {
  const myString = func();
  const myResolvedPromiseString = await asyncFunc();

  // Via the await keyword, now myResolvedPromiseString
  // is a string
  myString.length;
  myResolvedPromiseString.length;
};

// Code which is running via an await can throw errors,
// and it's important to catch those errors somewhere.

const myThrowingFunction = async () => {
  throw new Error("Do not call this");
};

// We can wrap calling an async function in a try catch to
// handle cases where the function acts unexpectedly.

const asyncFunctionCatching = async () => {
  const myReturnValue = "Hello world";
  try {
    await myThrowingFunction();
  } catch (error) {
    console.error("myThrowingFunction failed", error);
  }
  return myReturnValue;
};

// Due to the ergonomics of this API being either returning
// a single value, or throwing, you should consider offering
// information about the result inside the returned value and
// use throw only when something truly exceptional has
// occurred.

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

// Then the function consumers can check in the response and
// 确定如何使用您的返回值。尽管这是一个简单的例子，但是一旦您开始使用
// 网络代码，这些 API 就需要使用额外的语法。

const checkSquareRoot = async (value: number) => {
  const response = await exampleSquareRootFunction(value);
  if (response.success) {
    response.value;
  }
};

// Async、Await 使如下代码：

// getResponse(url, (response) => {
//   getResponse(response.url, (secondResponse) => {
//     const responseData = secondResponse.data
//     getResponse(responseData.url, (thirdResponse) => {
//       ...
//     })
//   })
// })

// 变为线性：

// const response = await getResponse(url)
// const secondResponse = await getResponse(response.url)
// const responseData = secondResponse.data
// const thirdResponse = await getResponse(responseData.url)
// ...

// 可以使代码左对齐，并且以一致的节奏阅读。
