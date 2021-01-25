//// { compiler: { ts: "3.8.3" }, isJavaScript: true }
// @ts-check

// TypeScriptのJSDocが拡張され、クラスプロパティのアクセス修飾子が
// サポートされるようになりました:
//
// @public - 設定しなかった場合のデフォルト
// @private - フィールドが定義されているクラスからのみ
//            アクセスできるフィールド
// @protected - フィールドが定義されているクラスとそのクラスの
//              サブクラスからアクセスできるフィールド


// 以下は、Animalの基底クラスで、privateフィールドとprotectedフィールドの
// 両方を持ちます。サブクラスは"this.isFast"にアクセスできますが、
// "this.type"にはアクセスできません。

// これらのクラスの外側では、両方のフィールドはどちらも表示されず、
// @ts-checkが有効になっている場合は
// コンパイラエラーとなります:

class Animal {
  constructor(type) {
    /** @private */
    this.type = type
    /** @protected */
    this.isFast = type === 'cheetah'
  }

  makeNoise() {
    // おそらく、これらのAnimalはとても静かなのでしょう
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

// 次のようには利用できません
housecat.type
housecat.isFast

// 詳細はこちらの記事で確認できます
// https://devblogs.microsoft.com/typescript/announcing-typescript-3-8-beta/#jsdoc-modifiers
