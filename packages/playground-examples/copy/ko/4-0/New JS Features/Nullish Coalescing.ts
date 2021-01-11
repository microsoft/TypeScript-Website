// # Nullish Coalescing
//
// `??`는 `||`의 일반적인 사용 방법을 보완하는 새로운 연산자입니다.
// `===`가 `==`의 사용을 더 엄격한 등호 형태로
// 보완하는 방식과 같습니다.
//
// 연산자를 이해하기 위해 어떻게 ||가 동작하는지 봅시다:

const response = {
  nullValue: null,
  headerText: "",
  animationDuration: 0,
  height: 400,
  showSplashScreen: false,
} as const;

const undefinedValue = response.undefinedValue || "some other default";
// 결과는 이렇게 됩니다: 'some other default'

const nullValue = response.nullValue || "some other default";

// 2개의 예시는 대부분 언어에서 비슷하게 동작합니다.
// 하나의 도구로써 || 연산자는 기본값을 설정할 때 매우 적합하지만,
// JavaScript falsy 체크는 몇 가지 일반적인 값으로 여러분을 당황하게 할 수 있습니다:

// 의도와 다를 수 있습니다. ''은 falsy고, 결과는 다음과 같습니다: 'Hello, world!'
const headerText = response.headerText || "Hello, world!";

// 의도와 다를 수 있습니다. 0은 falsy고, 결과는 다음과 같습니다: 300
const animationDuration = response.animationDuration || 300;

// 의도와 다를 수 있습니다. false는 falsy고, 결과는 다음과 같습니다: true
const showSplashScreen = response.showSplashScreen || true;

// 대신 ??으로 전환하여 사용한다면,
// === 등호는 양쪽을 비교하기 위해 사용됩니다:

const emptyHeaderText = response.headerText ?? "Hello, world!";
const zeroAnimationDuration = response.animationDuration ?? 300;
const skipSplashScreen = response.showSplashScreen ?? true;
