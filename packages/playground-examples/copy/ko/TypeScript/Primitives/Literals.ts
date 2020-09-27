// TypeScript는 소스 코드에서 리터럴을 위한
// 재미있고 특별한 기능들이 있습니다.

// 여기선, 타입 넓히기와 좁히기 ( example:type-widening-narrowing )가
// 중점적으로 다뤄지고 있으므로
// 그 부분을 먼저 살펴보도록 하곘습니다.

// 리터럴은 collection 타입의 더욱 구체적인 하위 타입입니다.
// 이는 "Hello World"는 string이지만,
// 타입 시스템에서 string은 "Hello World"가 아니라는 것을 의미합니다.

const helloWorld = "Hello World";
let hiWorld = "Hi World"; // 이것은 let이기 때문에 string입니다.

// 이 함수는 모든 string을 받습니다.
declare function allowsAnyString(arg: string);
allowsAnyString(helloWorld);
allowsAnyString(hiWorld);

// 이 함수는 "Hello World" string 리터럴만을 받습니다.
declare function allowsOnlyHello(arg: "Hello World");
allowsOnlyHello(helloWorld);
allowsOnlyHello(hiWorld);

// 이를 통해 특정 리터럴만을 받기 위해 union을 사용하는
// API를 선언할 수 있습니다.

declare function allowsFirstFiveNumbers(arg: 1 | 2 | 3 | 4 | 5);
allowsFirstFiveNumbers(1);
allowsFirstFiveNumbers(10);

let potentiallyAnyNumber = 3;
allowsFirstFiveNumbers(potentiallyAnyNumber);

// 언뜻 보기에, 이 규칙은 복잡한 객체들에는 적용되지 않습니다.

const myUser = {
  name: "Sabrina",
};

// 상수로 선언되어 있음에도 불구하고 이것이 어떻게
// `name: "Sabrina"`를 `name: string`으로 바꾸는지 보세요.
// 이는 여전히 이름이 언제든 바뀔 수 있기 때문입니다.

myUser.name = "Cynthia";

// myUser의 name 프로퍼티가 바뀔 수 있기 때문에,
// TypeScript는 타입 시스템에서 리터럴 버전을 사용할 수 없습니다.
// 하지만 이것을 가능하게끔 해주는 기능이 있습니다.

const myUnchangingUser = {
  name: "Fatma",
} as const;

// mutable object는 바뀔 수 있는 대신,
// 객체에 "as const"가 적용되면,
// object 리터럴이 되어 바뀌지 않습니다.

myUnchangingUser.name = "Raîssa";

// "as const"는 고정된 데이터를 다루는 좋은 도구이며,
// 코드를 한 줄의 리터럴로 적게끔 해줍니다.
// 또한 "as const"는 배열에서도 동작합니다.

const exampleUsers = [{ name: "Brian" }, { name: "Fahrooq" }] as const;
