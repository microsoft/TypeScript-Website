// JavaScript에는 객체를 불변으로 선언할 수 있는 몇 가지 방법이 있슴니다.
// 가장 일반적으로는 const를 쓰는 것입니다.
// const를 사용하면 값이 변하지 않습니다.

const helloWorld = "Hello World";

// 지금은 helloWorld를 바꿀 수 없습니다.
// 런타임에서 값을 얻게 되면
// TypeScript는 에러를 발생시키기 때문입니다.

helloWorld = "Hi world";

// 왜 불변성을 신경 써야 할까요?
// 가장 큰 이유는 코드의 복잡성을 줄이는 데 있습니다.
// 값이 변하는 대상을 줄일 수 있다면,
// 추적할 일이 줄어듭니다.

// const를 사용하는 것은 훌륭한 첫 단계지만,
// 객체를 사용할 때는 적용되지 않습니다.

const myConstantObject = {
  msg: "Hello World",
};

// myConstantObject는 상수가 될 수 없습니다.
// 여전히 객체의 일부를 변경할 수 있기 때문입니다.
// 예를 들어, msg를 변경할 수 있습니다.

myConstantObject.msg = "Hi World";

// const는 그 시점에 가리키는 값이 같은 값을 유지함을 의미하는데,
// 객체 그 자체로는 내부적으로 바뀔 수 있습니다.
// 이는 Object.freeze를 이용하여 바꿀 수 있습니다.

const myDefinitelyConstantObject = Object.freeze({
  msg: "Hello World",
});

// 객체가 freeze되면, 내부 요소들을 바꿀 수 없습니다.
// TypeScript에서는 이 경우 에러가 발생합니다.

myDefinitelyConstantObject.msg = "Hi World";

// 이는 배열에도 똑같이 적용됩니다.

const myFrozenArray = Object.freeze(["Hi"]);
myFrozenArray.push("World");

// freeze를 사용함으로써
// 객체가 내부적으로 동일하게 유지된다고 확신할 수 있습니다.

// TypeScript에는 불변 데이터를 다루는 것을 향상시키기 위한
// 몇몇 추가적인 hook 문법이 있습니다.
// 아래 예시의 TypeScript 섹션에서 확인할 수 있습니다.
//
// example:literals
// example:type-widening-and-narrowing
