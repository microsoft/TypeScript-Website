---
display: "Emit Decorator Metadata"
oneline: "Adds additional type metadata to decorators in emitted code"
---

[`reflect-metadata`](https://www.npmjs.com/package/reflect-metadata)モジュールとともに動作するデコレータのメタ情報を出力するための実験的なサポートを有効化します。

例えば、次のJavaScriptについて、

```ts twoslash
// @experimentalDecorators
function LogMethod(target: any, propertyKey: string | symbol, descriptor: PropertyDescriptor) {
  console.log(target);
  console.log(propertyKey);
  console.log(descriptor);
}

class Demo {
  @LogMethod
  public foo(bar: number) {
    // do nothing
  }
}

const demo = new Demo();
```

`emitDecoratorMetadata`がtrueに設定されていない場合（デフォルト）、次のようになります:

```ts twoslash
// @experimentalDecorators
// @showEmit
function LogMethod(target: any, propertyKey: string | symbol, descriptor: PropertyDescriptor) {
  console.log(target);
  console.log(propertyKey);
  console.log(descriptor);
}

class Demo {
  @LogMethod
  public foo(bar: number) {
    // 何もしない
  }
}

const demo = new Demo();
```

`emitDecoratorMetadata`がtrueに設定されている場合は、次のようになります:

```ts twoslash
// @experimentalDecorators
// @showEmit
// @emitDecoratorMetadata
function LogMethod(target: any, propertyKey: string | symbol, descriptor: PropertyDescriptor) {
  console.log(target);
  console.log(propertyKey);
  console.log(descriptor);
}

class Demo {
  @LogMethod
  public foo(bar: number) {
    // 何もしない
  }
}

const demo = new Demo();
```
