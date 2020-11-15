// 제네릭(Generics)은 타입을 다른 타입의 변수로
// 사용하는 방법과 메타데이터를 제공합니다.

// 이 예제는 앞으로도 가볍게 유지될 것입니다.
// 여러분은 제네릭으로 많은 작업을 수행하게 될 수도 있고,
// 언젠가는 제네릭을 사용하는 매우 복잡한 코드를 볼 수도 있습니다.
// 그렇다고 제네릭이 복잡하다는 이야기는 아닙니다.

// 입력 객체를 배열로 감싸는 예부터 살펴보겠습니다.
// 이 경우 전달된 하나의 변수에 대한 타입만
// 고려하면 됩니다:

function wrapInArray<Type>(input: Type): Type[] {
  return [input];
}

// 참고: T 타입은 흔히 볼 수 있습니다.
// 이는 문화적으로 사람들이 for 루프에서
// 색인으로 i 변수를 사용하는 것과 유사합니다.
// T는 일반적으로 Type을 나타내므로 명확성을 위해서는 전체 이름을 사용합니다.

// 위 함수는 전달된 변수 타입을 항상 유지시켜
// (배열 형태지만) 같은 변수 타입으로 전달할 수 있도록
// 인터페이스를 사용합니다.

const stringArray = wrapInArray("hello generics");
const numberArray = wrapInArray(123);

// 객체 배열을 반환하는 함수에 string 배열을
// 할당할 수 있는지 확인하는 것을 통해
// 예상대로 동작하는지 확인할 수 있습니다:
const notStringArray: string[] = wrapInArray({});

// 다음과 같이 타입을 직접 추가하여
// 제네릭 인터페이스를 건너 뛸 수도 있습니다:
const stringArray2 = wrapInArray<string>("");

// wrapInArray 함수에는
// 모든 타입이 사용될 수 있지만,
// 타입의 일정 부분만을 허용하는 경우도 있습니다.
// 이 경우 타입이 특정 타입을 확장해야 한다고 할 수 있습니다.

interface Drawable {
  draw: () => void;
}

// 이 함수는 화면에 그리는 기능을 가진 함수가 있는
// 객체 집합을 취합니다.
function renderToScreen<Type extends Drawable>(input: Type[]) {
  input.forEach(i => i.draw());
}

const objectsWithDraw = [{ draw: () => {} }, { draw: () => {} }];
renderToScreen(objectsWithDraw);

// draw 함수가 누락되면 이 함수는 동작하지 않습니다:

renderToScreen([{}, { draw: () => {} }]);

// 제네릭은 여러 변수를 다룰 때
// 복잡해 보일 수 있습니다.
// 다음은 다양한 입력 타입과
// 캐시의 집합을 가진 캐싱 함수의 예제입니다.

interface CacheHost {
  save: (a: any) => void;
}

function addObjectToCache<Type, Cache extends CacheHost>(obj: Type, cache: Cache): Cache {
  cache.save(obj);
  return cache;
}

// 이는 위 예제와 동일하지만 추가 파라미터가 있습니다.
// 참고: 위에서는 동작을 수행하기 위해서 any 타입을 사용해야 했습니다.
// 이 문제는 제네릭 인터페이스를 사용하여 해결할 수 있습니다.

interface CacheHostGeneric<ContentType> {
  save: (a: ContentType) => void;
}

// 이제 CacheHostGeneric을 사용할 때는
// ContentType이 무엇인지 명시해 주어야 합니다.

function addTypedObjectToCache<Type, Cache extends CacheHostGeneric<Type>>(obj: Type, cache: Cache): Cache {
  cache.save(obj);
  return cache;
}

// 제네릭은 문법 측면에서 꽤 빠르게 내용이 확장되었지만,
// 더 많은 안전성을 제공합니다.
// 이는 상호 절충으로 더 많은 지식을 쌓을 수 있습니다.
// 다른 사용자에게 API를 제공할 때 제네릭은 사용자 고유의 타입을
// 전체 코드 인터페이스와 함께 사용할 수 있는 유연한 방법을 제공합니다.

// 클래스와 인터페이스가 있는 제네릭의 더 많은 예제는 여기서 볼 수 있습니다:
//
// example:advanced-classes
// example:typescript-with-react
// https://www.typescriptlang.org/docs/handbook/generics.html
