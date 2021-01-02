// 2020년 버전의 JavaScript에서 논리 할당 연산자는 새로운 기능입니다.
// 이 연산자는 JavaScript 객체를 변경하는
// 새로운 연산자 모음입니다.

// 이 기능의 목표는 수학 연산자(예. += -= *=)의 개념을 재사용하지만,
// 그 대신 논리 연산자로 사용하는 것입니다.

interface User {
  id?: number
  name: string
  location: {
      postalCode?: string
  }
}

function updateUser(user: User) {
  // 이 코드는 대체 될 수 있습니다
  if (!user.id) user.id = 1

  // 또한 이 코드를:
  user.id = user.id || 1

  // 이 코드로:
  user.id ||= 1
}

// 연산자 모음은 중첩을 깊게 다룰 수 있어서,
// 꽤 많은 보일러플레이트 코드(boilerplate code)도 절약할 수 있습니다.

declare const user: User
user.location.postalCode ||= "90210"

// 새로운 연산자 3개가 있습니다:
//
//   ||= 위에 나와 있습니다
//   &&= 'or' 대신에 'and'를 사용합니다
//   ??= ===를 사용하는 대신에 ||의 더 엄격한 버전을 제공하는 
//       nullish-coalescing 예시를 토대로 사용합니다

// 제안에 대한 더 많은 정보는 다음을 참고해주세요:
// https://github.com/tc39/proposal-logical-assignment
