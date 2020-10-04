// any는 TypeScript의 탈출 구문입니다.
// 일부 코드를 JavaScript처럼 동적으로 동작하도록 선언하고 싶을 때,
// 또는 타입 시스템의 제한을 벗어나고 싶을 때
// any를 사용할 수 있습니다.

// JSON 파싱은 any의 좋은 예시입니다.

const myObject = JSON.parse("{}");

// any를 사용한다는 것은 여러분이 코드를 더 잘 알고 있음을 뜻하기 때문에,
// 타입이 완전히 정확하지 않더라도 TypeScript는 코드가 안전하다고 인식합니다.
// 예를 들어, 아래 코드는 오류가 발생합니다.

myObject.x.y.z;

// any를 사용하면 타입의 안전성을 희생하는 대신
// 코드를 원래의 JavaScript에 더욱 가깝게 작성할 수 있습니다.

// any는 어떤 타입(never를 제외하고)이든
// 다른 타입에 할당할 수 있도록 만드는
// '타입 와일드카드'와도 같습니다.

declare function debug(value: any): void;

debug("a string");
debug(23);
debug({ color: "blue" });

// 인수의 타입을 모두 any로 대신할 수 있기 때문에
// debug의 각 호출이 허용됩니다.

// TypeScript는 any의 위치를
// 다양한 형태에서 고려합니다.
// 함수 인수로 사용되는 아래의 튜플이 그 예시입니다.

declare function swap(x: [number, string]): [string, number];

declare const pair: [any, any];
swap(pair);

// pair의 첫 번째 any를 number로 대체하고,
// 두 번째 `any`를 string으로 대체하면서 인자가 매칭되기 때문에
// swap 호출이 가능합니다.

// 튜플을 처음 봤다면, 다음을 참고하세요: example:tuples

// unknown은 any의 자매 타입입니다.
// 만약 any가 "뭐가 최선인지 알겠어"와 같다면,
// unknown은 "뭐가 최선일지 모르니까, TS에 타입을 알려줘"와 같습니다.
// example:unknown-and-never
