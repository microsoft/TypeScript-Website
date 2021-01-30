//// { order: 2 }

// 클래스의 메서드를 호출할 때,
// 일반적으로 클래스의 현재 인스턴스를 참조할 것으로 예상합니다.

class Safe {
  contents: string;

  constructor(contents: string) {
    this.contents = contents;
  }

  printContents() {
    console.log(this.contents);
  }
}

const safe = new Safe("Crown Jewels");
safe.printContents();

// this/self를 쉽게 예상할 수 있는 객체지향언어 경험이 있다면
// 'this'가 얼마나 혼란스러울 수 있는지
// 확인할 필요가 있습니다:
//
// https://yehudakatz.com/2011/08/11/understanding-javascript-function-invocation-and-this/
// https://aka.ms/AA5ugm2

// 짧은 요약: this는 바뀔 수 있습니다.
// 여러분이 함수를 어떻게 호출하는지에 따라 this 참조가 달라질 것입니다.

// 예를 들어,
// 다른 객체의 함수에 대한 참조를 사용하고 이를 호출하면
// this 변수는 호스팅 객체를 참조하도록 이동됩니다:

const customObjectCapturingThis = { contents: "http://gph.is/VxeHsW", print: safe.printContents };
customObjectCapturingThis.print(); // "Crown Jewels"가 아닌 "http://gph.is/VxeHsW"를 출력합니다.

// 콜백 API를 다룰 때, 함수 참조를 직접 전달하는 것이
// 매우 용이할 수 있지만 까다롭습니다.
// 호출 위치에서 새로운 함수를 생성함으로써
// 이 문제를 해결할 수 있습니다.

const objectNotCapturingThis = { contents: "N/A", print: () => safe.printContents() };
objectNotCapturingThis.print();

// 문제를 해결하는 몇 가지 방법이 있습니다.
// 하나는 강제로 this 바인딩을
// bind를 통하여 원래 의도했던 객체로 만듭니다.

const customObjectCapturingThisAgain = { contents: "N/A", print: safe.printContents.bind(safe) };
customObjectCapturingThisAgain.print();

// 예기치 못한 이 context를 해결하기 위하여,
// 클래스에서 함수를 생성하는 방법을 변경할 수도 있습니다.
// 화살표 함수를 사용하는 프로퍼티를 만듦으로써,
// this의 바인딩은 다른 시간에 수행합니다.
// 따라서 덜 수행했던 context는 JavaScript 런타임에
// 더 예측할 수 있습니다.

class SafelyBoundSafe {
  contents: string;

  constructor(contents: string) {
    this.contents = contents;
  }

  printContents = () => {
    console.log(this.contents);
  };
}

// 이제 실행하기 위해 다른 객체에 함수를 전달하는 것은
// 뜻하지 않게 this를 변경하지 않습니다.

const saferSafe = new SafelyBoundSafe("Golden Skull");
saferSafe.printContents();

const customObjectTryingToChangeThis = {
  contents: "http://gph.is/XLof62",
  print: saferSafe.printContents,
};

customObjectTryingToChangeThis.print();

// 여러분이 TypeScript 프로젝트를 갖고 있다면,
// TypeScript가 함수에 대한 "this"가 어떤 타입인지 결정할 수 없는 경우를
// 강조하기 위해서, 컴파일러 플래그 noImplicitThis를 사용할 수 있습니다.

// 여러분은 핸드북에서 더 자세히 배울 수 있습니다:
//
// https://www.typescriptlang.org/docs/handbook/utility-types.html#thistypet
