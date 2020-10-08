// 열거형은 TypeScript로 쓰는 JavaScript에 추가된 기능입니다.
// 이를 통해 이름 붙은 변수들의 집합을 쉽게 다룰 수 있습니다.

// 기본적으로 열거형은 0부터 시작하는 숫자 기반이며,
// 각 항목은 1씩 증가하여 할당됩니다.
// 이는 값이 중요하지 않을 때 유용합니다.

enum CompassDirection {
  North,
  East,
  South,
  West,
}

// 열거 항목을 표기하여 값을 지정할 수 있으며,
// 그 값에서부터 증가가 시작됩니다:

enum StatusCodes {
  OK = 200,
  BadRequest = 400,
  Unauthorized,
  PaymentRequired,
  Forbidden,
  NotFound,
}

// EnumName.Value을 사용하여 열거형을 참조할 수 있습니다.

const startingDirection = CompassDirection.East;
const currentStatus = StatusCodes.OK;

// 열거형을 사용하여 key에서 value, 그리고 value에서 key 모든 방향으로
// 데이터에 접근할 수 있습니다.

const okNumber = StatusCodes.OK;
const okNumberIndex = StatusCodes["OK"];
const stringBadRequest = StatusCodes[400];

// 열거형은 여러 타입일 수 있지만, 일반적으로 string 타입입니다.
// string을 사용하면 디버깅이 쉬워지는데,
// 런타임에서의 값을 통해 숫자를 찾아볼 필요가 없어지기 때문입니다.

enum GamePadInput {
  Up = "UP",
  Down = "DOWN",
  Left = "LEFT",
  Right = "RIGHT",
}

// 만약 JavaScript 런타임에서 사용되는 객체의 수를 줄이고 싶다면,
// const enum을 쓸 수 있습니다.

// const enum의 값은
// 런타임에서 객체를 통해 찾아지는 대신
// 코드를 트랜스파일하는 과정에서 대체됩니다.

const enum MouseAction {
  MouseDown,
  MouseUpOutside,
  MouseUpInside,
}

const handleMouseAction = (action: MouseAction) => {
  switch (action) {
    case MouseAction.MouseDown:
      console.log("Mouse Down");
      break;
  }
};

// 트랜스파일된 JavaScript 코드를 보면,
// 다른 열거형들이 객체나 함수 형태로 존재하는 것을 볼 수 있지만,
// MouseAction은 그렇지 않습니다.

// 이는 handleMouseAction 안의 switch문에 있는
// MouseAction.MouseDown의 경우에도 마찬가지입니다.

// 열거형에는 이것보다 더 많은 기능이 있습니다.
// TypeScript 핸드북에서 더 알아볼 수 있습니다.
//
// https://www.typescriptlang.org/docs/handbook/enums.html
