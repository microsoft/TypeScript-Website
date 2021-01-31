//// { order: 2, compiler: { esModuleInterop: true } }

// 함수 체이닝 API는 JavaScript의 흔한 패턴입니다.
// 이는 여러분의 코드를 
// 중간값을 덜 포함함으로써 집중시킬 수 있고
// JavaScript 중첩 특성 덕분에 더 읽기 쉽게 만들 수 있습니다.

// 체이닝으로 동작하는 실제로 흔한 API는 jQuery입니다.
// 여기에 DefinitelyTyped의 타입과 함께 사용한
// jQuery 예시가 있습니다:

import $ from "jquery";

// jQuery API 사용 예시:

$("#navigation").css("background", "red").height(300).fadeIn(200);

// 위 라인에 점을 추가해보면,
// 긴 함수 리스트를 보게 될 것입니다.
// 이 패턴은 JavaScript에서 쉽게 재현할 수 있습니다.
// 핵심은 반드시 항상 같은 오브젝트 반환하는 것입니다.

// 여기 체이닝 API를 만드는 API 예시가 있습니다.
// 핵심은 내부 상태를 파악하고 있는 외부 함수와
// 항상 자신을 반환하는 API를
// 노출하는 오브젝트를 갖는 것입니다.

const addTwoNumbers = (start = 1) => {
  let n = start;

  const api = {
    // API에 있는 각 함수를 실행하세요
    add(inc: number = 1) {
      n += inc;
      return api;
    },

    print() {
      console.log(n);
      return api;
    },
  };
  return api;
};

// jQuery에서 본 것처럼
// 같은 스타일의 API를 허용:

addTwoNumbers(1).add(3).add().print().add(1);

// 클래스를 사용하는 비슷한 예시:

class AddNumbers {
  private n: number;

  constructor(start = 0) {
    this.n = start;
  }

  public add(inc = 1) {
    this.n = this.n + inc;
    return this;
  }

  public print() {
    console.log(this.n);
    return this;
  }
}

// 여기에서 동작:

new AddNumbers(2).add(3).add().print().add(1);

// 이 예시는 JavaScript 패턴에
// 도구를 제공하는 방법을 제공하기 위해서
// TypeScript 타입 추론을 사용했습니다.

// 더 많은 예시:
//
//  - example:code-flow
