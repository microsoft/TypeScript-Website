// 객체 형태를 선언하는 주요 도구는 두 가지가 있습니다.
// 인터페이스와 타입 별칭입니다.
//
// 이 둘은 무척 비슷하며,
// 대부분 동일하게 작동합니다.

type BirdType = {
  wings: 2;
};

interface BirdInterface {
  wings: 2;
}

const bird1: BirdType = { wings: 2 };
const bird2: BirdInterface = { wings: 2 };

// TypeScript는 구조적 타입 시스템을 따르기 때문에,
// 교차하여 사용하는 것도 가능합니다.

const bird3: BirdInterface = bird1;

// 둘 다 다른 인터페이스와 타입으로의 확장이 가능합니다.
// 타입 별칭은 교차 타입을 통해 이를 수행하는 반면,
// 인터페이스는 키워드를 사용합니다.

type Owl = { nocturnal: true } & BirdType;
type Robin = { nocturnal: false } & BirdInterface;

interface Peacock extends BirdType {
  colourful: true;
  flies: false;
}
interface Chicken extends BirdInterface {
  colourful: false;
  flies: false;
}

let owl: Owl = { wings: 2, nocturnal: true };
let chicken: Chicken = { wings: 2, colourful: false, flies: false };

// 그래도 타입 별칭보다 인터페이스를 쓰는 것을 추천합니다.
// 분명히 더 나은 에러 메시지를 받을 수 있기 때문입니다.
// 뒤따르는 에러에 커서를 가져가면,
// Chicken과 같은 인터페이스를 사용했을 때
// TypeScript가 더 간결하고 정확한 메시지를 어떻게 제공하는지 알 수 있습니다.

owl = chicken;
chicken = owl;

// 타입 별칭과 인터페이스 사이 한 가지 주요한 차이점은
// 인터페이스는 열려 있고 타입 별칭은 닫혀 있다는 것입니다.
// 이는 인터페이스를 다음에 선언할 때
// 확장할 수 있음을 의미합니다.

interface Kitten {
  purrs: boolean;
}

interface Kitten {
  colour: string;
}

// 이와 달리 타입은 선언 바깥에서
// 변경할 수 없습니다.

type Puppy = {
  color: string;
};

type Puppy = {
  toys: number;
};

// 목적에 따라서, 이 차이는 좋을 수도 나쁠 수도 있습니다.
// 하지만 공개된 타입들의 경우,
// 그것들을 인터페이스로 만드는 것이 더 좋습니다.

// 타입과 인터페이스에 대한 모든 엣지 케이스를 알고 싶다면,
// 아래 stack overflow thread가
// 시작하기 좋은 훌륭한 자료가 될 것입니다.

// https://stackoverflow.com/questions/37233735/typescript-interfaces-vs-types/52682220#52682220
