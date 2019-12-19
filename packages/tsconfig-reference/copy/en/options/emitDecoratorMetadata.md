---
display: "Emit Decorator Metadata"
---

Enables experimental support for emitting type metadata for decorators which works with the module [`reflect-metadata`](https://www.npmjs.com/package/reflect-metadata).

For example, here is the JavaScript

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

With `emitDecoratorMetadata` not set to true (default):

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
    // do nothing
  }
}

const demo = new Demo();
```

With `emitDecoratorMetadata` set to true:

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
    // do nothing
  }
}

const demo = new Demo();
```
