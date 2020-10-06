---
display: "Menghasilkan Dekorator Metadata"
oneline: "Menambahkan metadata jenis tambahan ke dekorator dalam kode yang dihasilkan"
---

Mengaktifkan dukungan eksperimental untuk menghasilkan tipe data metadata untuk dekorator yang bekerja dengan modul [`reflect-metadata`](https://www.npmjs.com/package/reflect-metadata).

Sebagai contoh, berikut adalah JavaScript

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

Dengan `emitDecoratorMetadata` tidak disetel ke true (bawaan):

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

Dengan `emitDecorationMetadata` di setel ke true:

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
