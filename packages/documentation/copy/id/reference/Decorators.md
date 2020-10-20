---
title: Decorators
layout: docs
permalink: /id/docs/handbook/decorators.html
oneline: Ringkasan Dekorator TypeScript
translatable: true
---

## Pengenalan

Dengan pengenalan Kelas-kelas yang ada di TypeScript dan ES6, sekarang ada skenario tertentu yang memerlukan fitur tambahan untuk mendukung anotasi atau modifikasi kelas dan anggota kelas.
Decorators menyediakan cara untuk menambahkan anotasi-anotasi dan sebuah sintaks pemrogragaman meta untuk deklarasi kelas dan anggota kelas.
Decorators ada pada [stage 2 proposal](https://github.com/tc39/proposal-decorators) untuk JavaScript dan juga tersedia pada TypeScript sebagai fitur eksperimental.

> CATATAN&emsp; Decorators adalah fitur eksperimental yang mungkin dapat berubah ketika dirilis nanti.

Untuk mengaktifkan Decorators eksperimental, anda harus menambahkan opsi `experimentalDecorators` ke baris perintah atau ke berkas `tsconfig.json`.

**Command Line**:

```shell
tsc --target ES5 --experimentalDecorators
```

**tsconfig.json**:

```json  tsconfig
{
  "compilerOptions": {
    "target": "ES5",
    "experimentalDecorators": true
  }
}
```

## Decorator

_Decorator_ adalah jenis deklarasi khusus yang dapat dilampirkan ke [deklarasi kelas](#class-decorators), [method](#method-decorators), [accessor](#accessor-decorators), [property](#property-decorators), atau [parameter](#parameter-decorators).
Decorators menggunakan bentuk `@expression`, dimana `expression` harus mengevaluasi fungsi yang akan dipanggil saat proses dengan informasi tentang deklarasi yang didekorasi.

Sebagai contoh, ada decorator `@sealed` yang mungkin kita akan menuliskan fungsi `sealed` sebagai berikut:

```ts
function sealed(target) {
  // lakukan sesuatu dengan 'target' ...
}
```

> CATATAN&emsp; Anda dapat melihat contoh lengkapnya di [Decorator Kelas](#class-decorators).

## Decorator Factories

Jika kita ingin menyesuaikan penerapan decorator pada sebuah deklarasi, kita dapat menuliskan sebuah decorator factory. _Decorator Factory_ adalah sebuah fungsi yang mengembalikan ekspresi yang akan dipanggil oleh decorator ketika proses.

Kita dapat menuliskan decorator factory seperti berikut:

```ts
function color(value: string) {
  // ini adalah decorator factory
  return function (target) {
    // ini adalah decorator
    // lakukan sesuatu dengan 'target' dan 'value'...
  };
}
```

> CATATAN&emsp; Anda dapat melihat contoh lengkap dari penggunaan decorator factory di [Method Decorators](#method-decorators)

## Komposisi Decorator

Lebih dari satu decorator dapat diterapkan pada sebuah deklarasi, seperti contoh berikut:

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

Ketika lebih dari satu decorator diterapkan ke sebuah deklarasi, evaluasi yang dilakukan mirip seperti [fungsi komposisi pada matematika](http://wikipedia.org/wiki/Function_composition). Pada model ini, ketika mengkomposisikan fungsi _f_ dan _g_, maka akan menjadi (_f_ ∘ _g_)(_x_) yang sama dengan _f_(_g_(_x_)).

Dengan demikian, langkah-langkah berikut dilakukan saat mengevaluasi beberapa dekorator pada satu deklarasi di TypeScript:

1. Ekspresi untuk setiap dekorator dievaluasi dari atas ke bawah.
2. Hasilnya kemudian disebut sebagai fungsi dari bawah ke atas.

If we were to use [decorator factories](#decorator-factories), we can observe this evaluation order with the following example:

JIka kita menggunakan [decorator factories](#decorator-factories), kita dapat mengamati urutan evaluasi ini dengan contoh berikut:

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

Yang akan mencetak keluaran ini ke console:

```shell
f(): evaluated
g(): evaluated
g(): called
f(): called
```

## Evaluasi Decorator

Ada urutan yang jelas tentang bagaimana decorator diterapkan ke berbagai deklarasi yang ada di dalam kelas:

1. _Parameter Decorators_, diikuti oleh _Method_, _Accessor_, atau _Property Decorators_ diterapkan untuk setiap anggota instance.
1. _Parameter Decorators_, diikuti oleh _Method_, _Accessor_, atau _Property Decorators_ diterapkan untuk setiap anggota statis.
1. _Parameter Dekorator_ diterapkan untuk konstruktor.
1. _Class Decorators_ diterapkan untuk kelas.

## Decorator Kelas

_Class Decorator_ dideklarasikan tepat sebelum deklarasi kelas.
Dekorator kelas diterapkan ke konstruktor kelas dan dapat digunakan untuk mengamati, memodifikasi, atau mengganti definisi kelas.
Dekorator kelas tidak dapat digunakan dalam file deklarasi, atau dalam konteks ambien lainnya (seperti pada kelas `deklarasi`).

Ekspresi untuk dekorator kelas akan dipanggil sebagai fungsi pada waktu proses, dengan konstruktor kelas yang didekorasi sebagai satu-satunya argumennya.

Jika dekorator kelas mengembalikan nilai, deklarasi kelas akan diganti dengan fungsi konstruktor yang disediakan.

> CATATAN&nbsp; Jika Anda memilih untuk mengembalikan fungsi konstruktor baru, Anda harus berhati-hati dalam mempertahankan prototipe asli.
> Logika yang menerapkan dekorator pada waktu proses **tidak akan** melakukannya untukmu.

Berikut ini adalah contoh decorator kelas (`@sealed`) yang diterapkan ke kelas `Greeter`:

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

Kita dapat mendefinisikan dekorator `@sealed` menggunakan deklarasi fungsi berikut:

```ts
function sealed(constructor: Function) {
  Object.seal(constructor);
  Object.seal(constructor.prototype);
}
```

Ketika `@sealed` dijalankan, itu akan menyegel konstruktor dan prototipe-nya.

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

_Method Decorator_ dideklarasikan tepat sebelum deklarasi metthod.
Dekorator diterapkan ke _Property Descriptor_ untuk method, yang dapat digunakan untuk mengamati, memodifikasi, atau mengganti definisi method.
Method Dekorator tidak dapat digunakan dalam file deklarasi, saat kelebihan beban, atau dalam konteks ambien lainnya (seperti dalam kelas `declare`).

Ekspresi untuk method decorator akan dipanggil sebagai fungsi pada waktu proses, dengan tiga argumen berikut:

1. Bisa memiliki fungsi konstruktor kelas untuk anggota statis, atau prototipe kelas untuk anggota instance.
2. Nama anggota.
3. The _Property Descriptor_ untuk anggota.

> CATATAN&emsp; _Property Descriptor_ akan menjadi `undefined` jika target skripmu dibawah `ES5`.

Jika method decorator mengembalikan sebuah nilai, maka akan digunakan sebagai _Property Descriptor_ untuk method.

> CATATAN&emsp; Nilai yang dikembalikan akan dibiarkan, jika target skripmu dibawah `ES5`.

Berikut adalah contoh penerapan method decorator (`@enumerable`) ke method yang ada pada kelas `Greeter`:

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

Kita dapat mendefinisikan dekorator `@enumerable` menggunakan fungsi deklarasi berikut:

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

Decorator `@enumerable(false)` disini adalah sebuah [decorator factory](#decorator-factories).
Ketika decorator `@enumerable(false)` dipanggil, ia akan merubah `enumerable` property dari property descriptor.

## Decorator Aksesor

Sebuah _Accessor Decorator_ dideklarasikan tepat sebelum sebuah deklarasi aksesor.
Decorator aksesor diterapkan ke _Property Descriptor_ untuk aksesor dan dapat digunakan untuk mengamati, memodifikasi, atau mengganti definisi aksesor.
Decorator aksesor tidak dapat digunakan dalam deklarasi file, atau dalam konteks ambien lainnya (seperti dalam kelas `declare`).

> CATATAN&emsp; TypeScript melarang penerapan decorator ke aksesor `get` dan `set` untuk single member.
> Sebaliknya, semua decorator untuk anggota harus diterapkan ke pengakses pertama yang ditentukan dalam urutan dokumen.
> Ini karena dekorator berlaku untuk _Property Descriptor_, yang menggabungkan aksesor `get` dan`set`, bukan setiap deklarasi secara terpisah.

Ekspresi untuk decorator pengakses akan dipanggil sebagai fungsi pada waktu proses, dengan tiga argumen berikut:

1. Bisa memiliki fungsi konstruktor kelas untuk anggota statis, atau prototipe kelas untuk anggota instance.
2. Nama anggota.
3. The _Property Descriptor_ untuk anggota.

> CATATAN&emsp; _Property Descriptor_ akan menjadi `undefined`, jika target skripmu dibawah `ES5`.

Jika aksesor decorator mengembalikan sebuah nilai, ia akan digunakan sebagai _Property Descriptor_ untuk anggota.

> CATATAN&emsp; Nilai yang dikembalikan akan dibiarkan, jika target skripmu dibawah `ES5`.

Berikut ada contoh penerapan aksesor decorator (`@configurable`) ke anggota kelas `Point`:

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

Kita dapat mendefinisikan decorator `@configurable` menggunakan deklarasi fungsi berikut:

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

## Property Decorators

Sebuah _Property Decorator_ dideklarasikan tepat sebelum deklarasi properti.
_Property Decorator_ tidak dapat digunakan dalam deklarasi file, atau dalam konteks ambien lainnya (seperti dalam kelas `declare`).

Ekspresi untuk property decorator akan dipanggil sebagai fungsi pada waktu proses, dengan dua argumen berikut:

1. Dapat berupa fungsi konstruktor kelas untuk anggota statis, atau prototipe kelas untuk anggota instance.
2. Nama anggota.

> CATATAN&emsp; _Property Descriptior_ tidak menyediakan sebuah argumen untuk property decorator karena bergantung tentang bagaimana property decorator diinisialisasi pada TypeScript.
> Ini karena, saat ini tidak ada mekanisme untuk mendeskripsikan sebuah instance property ketika mendefinisikan anggota dari sebuah prototipe, dan tidak ada cara untuk mengamati atau memodifikasi initializer untuk property. Dan nilai kembalian juga akan dibiarkan.
> Sehingga, sebuah property decorator hanya bisa digunakan untuk mengamati property dengan nama yang spesifik, yang telah dideklarasikan pada sebuah kelas.

Kita dapat menggunakan informasi tersebut untuk memantau property metadata, seperti pada contoh berikut:

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

Kemudian, kita dapat mendefinisikan decorator `@format` dan fungsi `getFormat` dengan menggunakan deklarasi fungsi berikut:

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

Decorator `@format("Hello, %s")` disini adalah sebuah [decorator factory](#decorator-factories).
Ketika `@format("Hello, %s")` dipanggil, ia akan menambahkan property metadata menggunakan fungsi `Reflect.metadata` dari pustaka `reflect-metadata`.
Ketika `getFormat` dipanggil, ia akan membaca format dari nilai metadata-nya.

> CATATAN&emsp; Contoh ini membutuhkan pustaka `reflect-metadata`.
> Lihat [Metadata](#metadata) untuk informasi lebih lanjut mengenai pustaka `reflect-metadata`.

## Parameter Decorators

_Parameter Decorator_ dideklarasikan tepat sebelum a parameter dideklarasikan.
Parameter decorator diterapkan ke fungsi konstruktor pada kelas atau saat deklarasi method.
Parameter decorator tidak dapat digunakan dalam deklarasi file, overload, atau dalam konteks ambien lainnya (seperti dalam kelas `declare`).

Ekspresi untuk parameter decorator akan dipanggil sebagai fungsi pada waktu proses, dengan tiga argumen berikut:

1. Dapat berupa fungsi konstruktor kelas untuk anggota statis, atau prototipe kelas untuk anggota instance.
2. Nama anggota.
3. Indeks ordinal dari parameter dalam daftar parameter fungsi.

> CATATAN&emsp; Sebuah parameter decorator hanya bisa digunakan untuk mengamati sebuah parameter yang telah dideklarasikan pada sebuah method.

Nilai kembalian dari parameter decorator akan dibiarkan.

Berikut adalah contoh penggunaan parameter decorator (`@required`) pada anggota kelas `Greeter`:

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

Kemudian, kita dapat mendefinisikan decorator `@required` dan `@validate` menggunakan deklarasi fungsi berikut:

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

Decorator `@required` menambahkan entri metadata yang menandakan bahwa parameter tersebut diperlukan.
Decorator `@validate` kemudian akan memvalidasi semua argumen yang ada, sebelum method-nya dijalankan.

> CATATAN&emsp; Contoh ini memerlukan pustaka `reflect-metadata`
> Lihat [Metadata](#metadata) untuk informasi lebih lanjut mengenai pustaka `reflect-metadata`.

## Metadata

Beberapa contoh menggunakan pustaka `reflect-metadata` yang menambahkan polyfill untuk [API metadata eksperimental](https://github.com/rbuckton/ReflectDecorators).
Pustaka ini belum menjadi bagian dari standar ECMAScript (JavaScript).
Namun, ketika decorator secara resmi diadopsi sebagai bagian dari standar ECMAScript, ekstensi ini akan diusulkan untuk diadopsi.

Anda dapat memasang pustaka ini melalui npm:

```shell
npm i reflect-metadata --save
```

TypeScript menyertakan dukungan eksperimental untuk menghadirkan jenis metadata tertentu untuk deklarasi yang memiliki decorator.
Untuk mengaktifkan dukungan eksperimental ini, Anda harus mengatur opsi compiler `emitDecoratorMetadata` baik pada baris perintah atau di `tsconfig.json` Anda:

**Command Line**:

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

Ketika diaktifkan, selama pustaka `reflect-metadata` di-import, informasi jenis design-time tambahan akan diekspos saat runtime.

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

Compiler TypeScript akan memasukkan informasi jenis design-time menggunakan decorator `@Reflect.metadata`.
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

> CATATAN&emsp; Decorator metadata adalah fitur experimental dan mungkin dapat menyebabkan gangguan pada rilis di masa mendatang.
