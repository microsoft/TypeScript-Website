---
title: Decorators
layout: docs
permalink: /id/docs/handbook/decorators.html
oneline: Ringkasan Dekorator TypeScript
translatable: true
---

## Pengenalan

Dengan pengenalan Kelas-kelas yang ada di TypeScript dan ES6, sekarang ada skenario tertentu yang memerlukan fitur tambahan untuk mendukung anotasi atau modifikasi kelas dan anggota kelas.
_Decorators_ menyediakan cara untuk menambahkan anotasi-anotasi dan sebuah sintaks pemrogragaman meta untuk deklarasi kelas dan anggota kelas.
_Decorators_ ada pada [stage 2 proposal](https://github.com/tc39/proposal-decorators) untuk JavaScript dan juga tersedia pada TypeScript sebagai fitur eksperimental.

> CATATAN&emsp; _Decorators_ adalah fitur eksperimental yang mungkin dapat berubah ketika dirilis nanti.

Untuk mengaktifkan _Decorators_ eksperimental, anda harus menambahkan opsi `experimentalDecorators` ke baris perintah atau ke berkas `tsconfig.json`.

**_Command Line_**:

```shell
tsc --target ES5 --experimentalDecorators
```

**tsconfig.json**:

```json tsconfig
{
  "compilerOptions": {
    "target": "ES5",
    "experimentalDecorators": true
  }
}
```

## _Decorator_

_Decorator_ adalah jenis deklarasi khusus yang dapat dilampirkan ke [deklarasi kelas](#class-decorators), [method](#method-decorators), [accessor](#accessor-decorators), [property](#property-decorators), atau [parameter](#parameter-decorators).
_Decorators_ menggunakan bentuk `@expression`, dimana `expression` harus mengevaluasi fungsi yang akan dipanggil saat proses dengan informasi tentang deklarasi yang didekorasi.

Sebagai contoh, ada decorator `@sealed` yang mungkin kita akan menuliskan fungsi `sealed` sebagai berikut:

```ts
function sealed(target) {
  // lakukan sesuatu dengan 'target' ...
}
```

> CATATAN&emsp; Anda dapat melihat contoh lengkapnya di [Decorator Kelas](#class-decorators).

## _Decorator Factories_

Jika kita ingin menyesuaikan penerapan _decorator_ pada sebuah deklarasi, kita dapat menuliskan sebuah _decorator factory_. _Decorator Factory_ adalah sebuah fungsi yang mengembalikan ekspresi yang akan dipanggil oleh _decorator_ ketika proses.

Kita dapat menuliskan _decorator factory_ seperti berikut:

```ts
function color(value: string) {
  // ini adalah decorator factory
  return function (target) {
    // ini adalah decorator
    // lakukan sesuatu dengan 'target' dan 'value'...
  };
}
```

> CATATAN&emsp; Anda dapat melihat contoh lengkap dari penggunaan _decorator factory_ di [_Method Decorators_](#method-decorators)

## Komposisi _Decorator_

Lebih dari satu _decorator_ dapat diterapkan pada sebuah deklarasi, seperti contoh berikut:

- Penerapan dengan satu baris:

  ```ts
  @f @g x
  ```

- Penerapan lebih dari satu baris:

  ```ts
  @f
  @g
  x
  ```

Ketika lebih dari satu _decorator_ diterapkan ke sebuah deklarasi, evaluasi yang dilakukan mirip seperti [fungsi komposisi pada matematika](http://wikipedia.org/wiki/Function_composition). Pada model ini, ketika mengkomposisikan fungsi _f_ dan _g_, maka akan menjadi (_f_ ∘ _g_)(_x_) yang sama dengan _f_(_g_(_x_)).

Dengan demikian, langkah-langkah berikut dilakukan saat mengevaluasi beberapa _decorator_ pada satu deklarasi di TypeScript:

1. Ekspresi untuk setiap _decorator_ dievaluasi dari atas ke bawah.
2. Hasilnya kemudian disebut sebagai fungsi dari bawah ke atas.

JIka kita menggunakan [_decorator factories_](#decorator-factories), kita dapat mengamati urutan evaluasi ini dengan contoh berikut:

```ts
function f() {
  console.log("f(): evaluated");
  return function (
    target,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    console.log("f(): called");
  };
}

function g() {
  console.log("g(): evaluated");
  return function (
    target,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    console.log("g(): called");
  };
}

class C {
  @f()
  @g()
  method() {}
}
```

Yang akan mencetak keluaran ini ke _console_:

```shell
f(): evaluated
g(): evaluated
g(): called
f(): called
```

## Evaluasi _Decorator_

Ada urutan yang jelas tentang bagaimana _decorator_ diterapkan ke berbagai deklarasi yang ada di dalam kelas:

1. _Parameter Decorators_, diikuti oleh _Method_, _Accessor_, atau _Property Decorators_ diterapkan untuk setiap anggota instance.
1. _Parameter Decorators_, diikuti oleh _Method_, _Accessor_, atau _Property Decorators_ diterapkan untuk setiap anggota statis.
1. _Parameter Dekorator_ diterapkan untuk konstruktor.
1. _Class Decorators_ diterapkan untuk kelas.

## _Decorator_ Kelas

_Class Decorator_ dideklarasikan tepat sebelum deklarasi kelas.
_Decorator_ kelas diterapkan ke konstruktor kelas dan dapat digunakan untuk mengamati, memodifikasi, atau mengganti definisi kelas.
_Decorator_ kelas tidak dapat digunakan dalam berkas deklarasi, atau dalam konteks ambien lainnya (seperti pada kelas `deklarasi`).

Ekspresi untuk _decorator_ kelas akan dipanggil sebagai fungsi pada waktu proses, dengan konstruktor kelas yang didekorasi sebagai satu-satunya argumennya.

Jika _decorator_ kelas mengembalikan nilai, deklarasi kelas akan diganti dengan fungsi konstruktor yang disediakan.

> CATATAN&nbsp; Jika Anda memilih untuk mengembalikan fungsi konstruktor baru, Anda harus berhati-hati dalam mempertahankan prototipe asli.
> Logika yang menerapkan dekorator pada waktu proses **tidak akan** melakukannya untukmu.

Berikut ini adalah contoh _decorator_ kelas (`@sealed`) yang diterapkan ke kelas _`Greeter`_:

```ts
@sealed
class Greeter {
  greeting: string;
  constructor(message: string) {
    this.greeting = message;
  }
  greet() {
    return "Hello, " + this.greeting;
  }
}
```

Kita dapat mendefinisikan _decorator_ `@sealed` menggunakan deklarasi fungsi berikut:

```ts
function sealed(constructor: Function) {
  Object.seal(constructor);
  Object.seal(constructor.prototype);
}
```

Ketika `@sealed` dijalankan, itu akan menyegel konstruktor dan prototipenya.

Selanjutnya kita memiliki contoh bagaimana menimpa konstruktor.

```ts
function classDecorator<T extends { new (...args: any[]): {} }>(
  constructor: T
) {
  return class extends constructor {
    newProperty = "new property";
    hello = "override";
  };
}

@classDecorator
class Greeter {
  property = "property";
  hello: string;
  constructor(m: string) {
    this.hello = m;
  }
}

console.log(new Greeter("world"));
```

## Method Decorators

_Method Decorator_ dideklarasikan tepat sebelum deklarasi _method_.
Dekorator diterapkan ke _Property Descriptor_ untuk method, yang dapat digunakan untuk mengamati, memodifikasi, atau mengganti definisi _method_.
_Method Decorator_ tidak dapat digunakan dalam berkas deklarasi, saat kelebihan beban, atau dalam konteks ambien lainnya (seperti dalam kelas `declare`).

Ekspresi untuk _method decorator_ akan dipanggil sebagai fungsi pada waktu proses, dengan tiga argumen berikut:

1. Bisa memiliki fungsi konstruktor kelas untuk anggota statis, atau prototipe kelas untuk anggota _instance_.
2. Nama anggota.
3. The _Property Descriptor_ untuk anggota.

> CATATAN&emsp; _Property Descriptor_ akan menjadi `undefined` jika target skripmu dibawah `ES5`.

Jika _method decorator_ mengembalikan sebuah nilai, maka akan digunakan sebagai _Property Descriptor_ untuk method.

> CATATAN&emsp; Nilai yang dikembalikan akan dibiarkan, jika target kodemu dibawah `ES5`.

Berikut adalah contoh penerapan _method decorator_ (`@enumerable`) ke method yang ada pada kelas _`Greeter`_:

```ts
class Greeter {
  greeting: string;
  constructor(message: string) {
    this.greeting = message;
  }

  @enumerable(false)
  greet() {
    return "Hello, " + this.greeting;
  }
}
```

Kita dapat mendefinisikan _decorator_ `@enumerable` menggunakan fungsi deklarasi berikut:

```ts
function enumerable(value: boolean) {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    descriptor.enumerable = value;
  };
}
```

_Decorator_ `@enumerable(false)` disini adalah sebuah [_decorator factory_](#decorator-factories).
Ketika _decorator_ `@enumerable(false)` dipanggil, ia akan merubah _`enumerable`_ properti dari properti _descriptor_.

## _Decorator_ Aksesor

Sebuah _Accessor Decorator_ dideklarasikan tepat sebelum sebuah deklarasi aksesor.
_Decorator_ aksesor diterapkan ke _Property Descriptor_ untuk aksesor dan dapat digunakan untuk mengamati, memodifikasi, atau mengganti definisi aksesor.
_Decorator_ aksesor tidak dapat digunakan dalam deklarasi berkas, atau dalam konteks ambien lainnya (seperti dalam kelas `declare`).

> CATATAN&emsp; TypeScript melarang penerapan _decorator_ ke aksesor `get` dan `set` untuk _single_ member.
> Sebaliknya, semua _decorator_ untuk anggota harus diterapkan ke pengakses pertama yang ditentukan dalam urutan dokumen.
> Ini karena _decorator_ berlaku untuk _Property Descriptor_, yang menggabungkan aksesor `get` dan `set`, bukan setiap deklarasi secara terpisah.

Ekspresi untuk _decorator_ pengakses akan dipanggil sebagai fungsi pada waktu proses, dengan tiga argumen berikut:

1. Bisa memiliki fungsi konstruktor kelas untuk anggota statis, atau prototipe kelas untuk anggota _instance_.
2. Nama anggota.
3. The _Property Descriptor_ untuk anggota.

> CATATAN&emsp; _Property Descriptor_ akan menjadi `undefined`, jika target skripmu dibawah `ES5`.

Jika aksesor _decorator_ mengembalikan sebuah nilai, ia akan digunakan sebagai _Property Descriptor_ untuk anggota.

> CATATAN&emsp; Nilai yang dikembalikan akan dibiarkan, jika target skripmu dibawah `ES5`.

Berikut ada contoh penerapan aksesor _decorator_ (`@configurable`) ke anggota kelas _`Point`_:

```ts
class Point {
  private _x: number;
  private _y: number;
  constructor(x: number, y: number) {
    this._x = x;
    this._y = y;
  }

  @configurable(false)
  get x() {
    return this._x;
  }

  @configurable(false)
  get y() {
    return this._y;
  }
}
```

Kita dapat mendefinisikan _decorator_ `@configurable` menggunakan deklarasi fungsi berikut:

```ts
function configurable(value: boolean) {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    descriptor.configurable = value;
  };
}
```

## _Property Decorators_

Sebuah _Property Decorator_ dideklarasikan tepat sebelum deklarasi properti.
_Property Decorator_ tidak dapat digunakan dalam deklarasi berkas, atau dalam konteks ambien lainnya (seperti dalam kelas `declare`).

Ekspresi untuk properti decorator akan dipanggil sebagai fungsi pada waktu proses, dengan dua argumen berikut:

1. Dapat berupa fungsi konstruktor kelas untuk anggota statis, atau prototipe kelas untuk anggota _instance_.
2. Nama anggota.

> CATATAN&emsp; _Property Descriptior_ tidak menyediakan sebuah argumen untuk properti _decorator_ karena bergantung tentang bagaimana properti _decorator_ diinisialisasi pada TypeScript.
> Ini karena, saat ini tidak ada mekanisme untuk mendeskripsikan sebuah _instance_ properti ketika mendefinisikan anggota dari sebuah prototipe, dan tidak ada cara untuk mengamati atau memodifikasi _initializer_ untuk properti. Dan nilai kembalian juga akan dibiarkan.
> Sehingga, sebuah properti _decorator_ hanya bisa digunakan untuk mengamati properti dengan nama yang spesifik, yang telah dideklarasikan pada sebuah kelas.

Kita dapat menggunakan informasi tersebut untuk memantau properti metadata, seperti pada contoh berikut:

```ts
class Greeter {
  @format("Hello, %s")
  greeting: string;

  constructor(message: string) {
    this.greeting = message;
  }
  greet() {
    let formatString = getFormat(this, "greeting");
    return formatString.replace("%s", this.greeting);
  }
}
```

Kemudian, kita dapat mendefinisikan _decorator_ `@format` dan fungsi `getFormat` dengan menggunakan deklarasi fungsi berikut:

```ts
import "reflect-metadata";

const formatMetadataKey = Symbol("format");

function format(formatString: string) {
  return Reflect.metadata(formatMetadataKey, formatString);
}

function getFormat(target: any, propertyKey: string) {
  return Reflect.getMetadata(formatMetadataKey, target, propertyKey);
}
```

_Decorator_ `@format("Hello, %s")` disini adalah sebuah [decorator factory](#decorator-factories).
Ketika `@format("Hello, %s")` dipanggil, ia akan menambahkan properti metadata menggunakan fungsi `Reflect.metadata` dari pustaka `reflect-metadata`.
Ketika `getFormat` dipanggil, ia akan membaca format dari nilai _metadata_-nya.

> CATATAN&emsp; Contoh ini membutuhkan pustaka `reflect-metadata`.
> Lihat [Metadata](#metadata) untuk informasi lebih lanjut mengenai pustaka `reflect-metadata`.

## _Parameter Decorators_

_Parameter Decorator_ dideklarasikan tepat sebelum a parameter dideklarasikan.
_Parameter decorator_ diterapkan ke fungsi konstruktor pada kelas atau saat deklarasi _method_.
_Parameter decorator_ tidak dapat digunakan dalam deklarasi berkas, overload, atau dalam konteks ambien lainnya (seperti dalam kelas `declare`).

Ekspresi untuk _parameter decorator_ akan dipanggil sebagai fungsi pada waktu proses, dengan tiga argumen berikut:

1. Dapat berupa fungsi konstruktor kelas untuk anggota statis, atau prototipe kelas untuk anggota _instance_.
2. Nama anggota.
3. Indeks ordinal dari parameter dalam daftar parameter fungsi.

> CATATAN&emsp; Sebuah _parameter decorator_ hanya bisa digunakan untuk mengamati sebuah parameter yang telah dideklarasikan pada sebuah method.

Nilai kembalian dari _parameter decorator_ akan dibiarkan.

Berikut adalah contoh penggunaan _parameter decorator_ (`@required`) pada anggota kelas `Greeter`:

```ts
class Greeter {
  greeting: string;

  constructor(message: string) {
    this.greeting = message;
  }

  @validate
  greet(@required name: string) {
    return "Hello " + name + ", " + this.greeting;
  }
}
```

Kemudian, kita dapat mendefinisikan _decorator_ `@required` dan `@validate` menggunakan deklarasi fungsi berikut:

```ts
import "reflect-metadata";

const requiredMetadataKey = Symbol("required");

function required(
  target: Object,
  propertyKey: string | symbol,
  parameterIndex: number
) {
  let existingRequiredParameters: number[] =
    Reflect.getOwnMetadata(requiredMetadataKey, target, propertyKey) || [];
  existingRequiredParameters.push(parameterIndex);
  Reflect.defineMetadata(
    requiredMetadataKey,
    existingRequiredParameters,
    target,
    propertyKey
  );
}

function validate(
  target: any,
  propertyName: string,
  descriptor: TypedPropertyDescriptor<Function>
) {
  let method = descriptor.value;
  descriptor.value = function () {
    let requiredParameters: number[] = Reflect.getOwnMetadata(
      requiredMetadataKey,
      target,
      propertyName
    );
    if (requiredParameters) {
      for (let parameterIndex of requiredParameters) {
        if (
          parameterIndex >= arguments.length ||
          arguments[parameterIndex] === undefined
        ) {
          throw new Error("Missing required argument.");
        }
      }
    }

    return method.apply(this, arguments);
  };
}
```

_Decorator_ `@required` menambahkan entri metadata yang menandakan bahwa parameter tersebut diperlukan.
_Decorator_ `@validate` kemudian akan memvalidasi semua argumen yang ada, sebelum _method_-nya dijalankan.

> CATATAN&emsp; Contoh ini memerlukan pustaka `reflect-metadata`
> Lihat [Metadata](#metadata) untuk informasi lebih lanjut mengenai pustaka `reflect-metadata`.

## _Metadata_

Beberapa contoh menggunakan pustaka `reflect-metadata` yang menambahkan _polyfill_ untuk [API metadata eksperimental](https://github.com/rbuckton/ReflectDecorators).
Pustaka ini belum menjadi bagian dari standar ECMAScript (JavaScript).
Namun, ketika decorator secara resmi diadopsi sebagai bagian dari standar ECMAScript, ekstensi ini akan diusulkan untuk diadopsi.

Anda dapat memasang pustaka ini melalui npm:

```shell
npm i reflect-metadata --save
```

TypeScript menyertakan dukungan eksperimental untuk menghadirkan jenis _metadata_ tertentu untuk deklarasi yang memiliki _decorator_.
Untuk mengaktifkan dukungan eksperimental ini, Anda harus mengatur opsi kompilator `emitDecoratorMetadata` baik pada baris perintah atau di `tsconfig.json` Anda:

**_Command Line_**:

```shell
tsc --target ES5 --experimentalDecorators --emitDecoratorMetadata
```

**tsconfig.json**:

```json tsconfig
{
  "compilerOptions": {
    "target": "ES5",
    "experimentalDecorators": true,
    "emitDecoratorMetadata": true
  }
}
```

Ketika diaktifkan, selama pustaka `reflect-metadata` di-_import_, informasi jenis _design-time_ tambahan akan diekspos saat _runtime_.

Kita dapat melihat action pada contoh berikut:

```ts
import "reflect-metadata";

class Point {
  x: number;
  y: number;
}

class Line {
  private _p0: Point;
  private _p1: Point;

  @validate
  set p0(value: Point) {
    this._p0 = value;
  }
  get p0() {
    return this._p0;
  }

  @validate
  set p1(value: Point) {
    this._p1 = value;
  }
  get p1() {
    return this._p1;
  }
}

function validate<T>(
  target: any,
  propertyKey: string,
  descriptor: TypedPropertyDescriptor<T>
) {
  let set = descriptor.set;
  descriptor.set = function (value: T) {
    let type = Reflect.getMetadata("design:type", target, propertyKey);
    if (!(value instanceof type)) {
      throw new TypeError("Invalid type.");
    }
    set.call(target, value);
  };
}
```

Kompilator TypeScript akan memasukkan informasi jenis _design-time_ menggunakan _decorator_ `@Reflect.metadata`.
Anda dapat menganggapnya setara dengan TypeScript berikut:

```ts
class Line {
  private _p0: Point;
  private _p1: Point;

  @validate
  @Reflect.metadata("design:type", Point)
  set p0(value: Point) {
    this._p0 = value;
  }
  get p0() {
    return this._p0;
  }

  @validate
  @Reflect.metadata("design:type", Point)
  set p1(value: Point) {
    this._p1 = value;
  }
  get p1() {
    return this._p1;
  }
}
```

> CATATAN&emsp; _Decorator_ metadata adalah fitur _experimental_ dan mungkin dapat menyebabkan gangguan pada rilis di masa mendatang.
