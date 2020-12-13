//// { compiler: { ts: "3.8.3" } }
// 3.8에서는 private 필드가 추가됩니다. 이는 하위 클래스(subclass)를 포함하여,
// 해당 필드를 가지고 있는 클래스 외부에서 사용할 수 없도록 하기 위한 클래스 필드 선언 방법입니다.

// 예를 들어, 아래의 Person 클래스는 클래스의 인스턴스를 사용하는 누구에게도
// firstName, lastName 또는 prefix를 읽는 것을 허용하지 않습니다

class Person {
  #firstName: string;
  #lastName: string;
  #prefix: string;

  constructor(firstName: string, lastName: string, prefix: string) {
    this.#firstName = firstName;
    this.#lastName = lastName;
    this.#prefix = prefix;
  }

  greet() {
    // 아이슬란드에서는 [prefix] [lastname] 대신 전체 이름을 사용하는 것을 선호합니다
    // https://www.w3.org/International/questions/qa-personal-names#patronymic
    if (navigator.languages[0] === "is") {
      console.log(`Góðan dag, ${this.#firstName} ${this.#lastName}`);
    } else {
      console.log(`Hello, ${this.#prefix} ${this.#lastName}`);
    }
  }
}

let jeremy = new Person("Jeremy", "Bearimy", "Mr");

// 클래스 외부에서는 어떠한 private 필드에도 접근할 수 없습니다:

// 예를 들어, 이것은 동작하지 않을 것입니다:
console.log(jeremy.#lastName);

// 이것 또한:
console.log("Person's last name:", jeremy["#lastName"]);

// 우리는 흔히 
// "왜 클래스 필드에 있는 'private' 키워드 대신 이것을 사용하려고 하나요?"라는 질문을 받습니다. 
// TypeScript 3.8 이전에 어떻게 동작했었는지 비교해 봅시다:

class Dog {
  private _name: string;
  constructor(name: string) {
    this._name = name;
  }
}

let oby = new Dog("Oby");
// 점 표기법으로 접근할 수 없습니다
oby._name = "Spot";
// 하지만 TypeScript는 예외 사항으로 대괄호 표기법을 허용합니다
oby["_name"] = "Cherny";

// private의 TypeScript 참조는 타입 레벨에서만 존재하므로
// 여러분이 여기까지만 신뢰할 수 있다는 의미입니다.
// private 필드가 곧 JavaScript 언어의 일부가 되면,
// 여러분의 코드의 가시성에 대해 더 나은 보장을 할 수 있습니다.

// 우리는 TypeScript에서 'private' 키워드를 지원 중단할 예정이 없습니다.
// 그래서 기존 코드는 계속 동작할 것이지만, 
// 대신에 이제 여러분은 JavaScript 언어에 좀 더 가까운 코드를 작성할 수 있습니다.

// tc39 proposal에서 클래스 필드에 관하여 더 배울 수 있습니다
// https://github.com/tc39/proposal-class-fields/
// 그리고 베타 릴리즈 노트에서:
// https://devblogs.microsoft.com/typescript/announcing-typescript-3-8-beta/#ecmascript-private-fields
