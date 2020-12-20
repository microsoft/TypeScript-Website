// Unknown

// Unknown은 검색하면
// 꽤 다양한 용도를 찾을 수 있는 타입 중 하나입니다.
// 이는 any 타입의 자매처럼 작동합니다. any가 모호함을 나타내는 반면
// unknown은 세부사항을 필요로 합니다.

// JSON 파서를 감싸는 것이 좋은 예시가 될 수 있습니다.
// JSON 데이터는 서로 다른 형식으로 제공되며,
// json 파싱 함수의 작성자는 데이터의 형식을 알 수 없습니다.
// 그 형식은 함수를 호출한 사람이 알고 있습니다.

const jsonParser = (jsonString: string) => JSON.parse(jsonString);

const myAccount = jsonParser(`{ "name": "Dorothea" }`);

myAccount.name;
myAccount.email;

// jsonParser에 마우스를 올리면, 반환 타입이 any이고
// myAccount 또한 동일합니다.
// 이는 Generic을 이용하여 해결할 수 있지만
// unknown으로 해결할 수도 있습니다.

const jsonParserUnknown = (jsonString: string): unknown => JSON.parse(jsonString);

const myOtherAccount = jsonParserUnknown(`{ "name": "Samuel" }`);

myOtherAccount.name;

// myOtherAccount 객체는 TypeScript에 타입이 선언되기 전까지
// 사용될 수 없습니다. 이것은 API를 사용하는 사람이
// 올바르게 타입을 정의하는지 생각하게끔 해 줍니다.

type User = { name: string };
const myUserAccount = jsonParserUnknown(`{ "name": "Samuel" }`) as User;
myUserAccount.name;

// Unknown은 훌륭한 도구입니다. 더 자세히 알아보고 싶다면 다음 자료를 읽어보세요:
// https://mariusschulz.com/blog/the-unknown-type-in-typescript
// https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-0.html#new-unknown-top-type

// Never

// TypeScript는 코드 흐름 분석을 지원하기 때문에,
// 코드가 논리적으로 발생할 수 없는 경우를 나타낼 수 있어야 합니다.
// 예를 들어, 아래 함수는 반환되지 않습니다:

const neverReturns = () => {
  // 첫 번째 줄에서 throw하는 경우
  throw new Error("Always throws, never returns");
};

// 타입에 마우스를 올리면, 이것이 절대로 발생할 수 없다는 것을 의미하는
// () => never 타입이라는 것을 알 수 있습니다.
// 이러한 값은 다른 값과 마찬가지로 여전히 전달될 수 있습니다.

const myValue = neverReturns();

// 함수의 리턴값을 never로 작성하는 것은
// JavaScript 런타임 시 예측 불가능하거나
// API를 사용하는 사람이 type을 사용하지 않았을 때 유용합니다.

const validateUser = (user: User) => {
  if (user) {
    return user.name !== "NaN";
  }

  // 타입 시스템에 따르면, 아래 코드는 절대 실행 될 수 없는데,
  // 이는 neverReturns의 반환 타입에 해당합니다.

  return neverReturns();
};

// 타입 정의는 user가 전달되어야 하지만
// JavaScript에 이를 보장할 수 없는
// 충분한 탈출구가 있음을 의미합니다.

// never를 반환하는 함수를 사용하면
// 불가능한 위치에 추가적인 코드를 사용하게끔 해 줍니다.
// 이는 더 나은 에러 메시지를 보여주거나
// 파일 또는 반복문과 같은 자원을 닫는 데 유용합니다.

// never는 주로 switch문이 완전하다는 것을 보장할 때 사용됩니다.
// E.g., 모든 경우가 다뤄짐을 의미합니다.

// enum과 완전한 switch문이 있습니다.
// enum에 새 옵션(예를 들면 Tulip?)을 넣어보세요.

enum Flower {
  Rose,
  Rhododendron,
  Violet,
  Daisy,
}

const flowerLatinName = (flower: Flower) => {
  switch (flower) {
    case Flower.Rose:
      return "Rosa rubiginosa";
    case Flower.Rhododendron:
      return "Rhododendron ferrugineum";
    case Flower.Violet:
      return "Viola reichenbachiana";
    case Flower.Daisy:
      return "Bellis perennis";

    default:
      const _exhaustiveCheck: never = flower;
      return _exhaustiveCheck;
  }
};

// 새로운 꽃의 타입이 never로 변환될 수 없다는
// 컴파일 에러가 발생할 것입니다.

// 교차 타입에서의 Never

// Never는 교차타입에서
// 자동적으로 제거되는 타입입니다.

type NeverIsRemoved = string | never | number;

// NeverIsRemoved 타입을 보면,
// string | number인 것을 확인할 수 있습니다.
// never에는 할당할 수 없기 때문에 런타임에서는 절대 발생하지 않을 것이기 때문입니다.

// 이 항목은 example:conditional-types에서 많이 사용됩니다.
