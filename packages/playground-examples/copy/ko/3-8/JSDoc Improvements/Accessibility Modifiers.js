//// { compiler: { ts: "3.8.3" }, isJavaScript: true }
// @ts-check

// TypeScript에 대한 JSDoc 지원은 
// 클래스 프로퍼티에 접근 지정자를 지원하기 위해 확장했습니다:
//
// @public - 기본값이며, 1로 설정하지 않으면 발생하는 것 입니다.
// @private - 필드가 정의된 같은 클래스에서만
//            접근할 수 있는 필드 
// @protected - 필드가 정의되고 그 클래스의 하위 클래스가 있는
//              클래스에 접근될 수 있는 필드
//

// Animal의 기본 클래스입니다, private과 protected 필드를 둘 다 가지고 있습니다.
// 하위 클래스는 "this.isFast"를 접근할 수 있지만,
// "this.type"은 접근할 수 없습니다.

// 이런 클래스의 외부에서,
// 두 필드는 보이지 않고 // @ts-check가 실행 중일 때
// 컴파일러 에러를 반환합니다:

class Animal {
  constructor(type) {
    /** @private */
    this.type = type
    /** @protected */
    this.isFast = type === 'cheetah'
  }

  makeNoise() {
    // 아마 꽤 많이 조용할 것입니다
    if (this.type === 'bengal') {
      console.log('')
    } else {
      throw new Error('makeNoise was called on a base class')
    }
  }
}

class Cat extends Animal {
  constructor(type) {
    super(type || 'housecat')
  }

  makeNoise() {
    console.log('meow')
  }

  runAway() {
    if (this.isFast) {
      console.log('Got away')
    } else {
      console.log('Did not make it')
    }
  }
}

class Cheetah extends Cat {
  constructor() {
    super('cheetah')
  }
}

class Bengal extends Cat {
  constructor() {
    super('bengal')
  }
}

const housecat = new Cat()
housecat.makeNoise()

// 이것은 사용할 수 없습니다
housecat.type
housecat.isFast

// 여러분은 글에서 더 많은 것을 읽을 수 있습니다
// https://devblogs.microsoft.com/typescript/announcing-typescript-3-8-beta/#jsdoc-modifiers
