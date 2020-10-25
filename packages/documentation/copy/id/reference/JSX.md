---
title: JSX
layout: docs
permalink: /id/docs/handbook/jsx.html
oneline: Menggunakan JSX dengan TypeScript
translatable: true
---

[JSX](https://facebook.github.io/jsx/) adalah sebuah sintaks tertanam, yang seperti XML.
Ini dimaksudkan untuk diubah menjadi JavaScript yang valid, meskipun semantik dari transformasi itu khusus untuk implementasi.
JSX menjadi populer dengan kerangka kerja [React](https://reactjs.org/), tetapi sejak itu juga melihat implementasi lain.
TypeScript mendukung embeding, pemeriksaan tipe, dan mengkompilasi JSX secara langsung ke JavaScript.

## Dasar Penggunaan

Untuk menggunakan JSX, Anda harus melakukan dua hal berikut:

1. Penamaan file dengan ekstensi `.tsx`
2. Mengaktifkan opsi `jsx`

TypeScript memiliki tiga jenis mode JSX: `preserve`, `react`, dan `react-native`.
Mode tersebut hanya berlaku untuk stage, sedangkan untuk pemeriksaan tipe, hal itu tidak berlaku.
Mode `preserve` akan mempertahankan JSX sebagai bagian dari output untuk selanjutnya digunakan oleh langkah transformasi lain (mis. [Babel](https://babeljs.io/)).
Selain itu, output-nya akan memiliki ekstensi file `.jsx`.
Mode `react` akan mengeluarkan`React.createElement`, tidak perlu melalui transformasi JSX sebelum digunakan, dan outputnya akan memiliki ekstensi file `.js`.
Mode `react-native` sama dengan `pertahankan` yang mempertahankan semua JSX, tetapi hasilnya justru akan memiliki ekstensi file `.js`.

| Mode           | Input     | Output                       | Output File Extension |
| -------------- | --------- | ---------------------------- | --------------------- |
| `preserve`     | `<div />` | `<div />`                    | `.jsx`                |
| `react`        | `<div />` | `React.createElement("div")` | `.js`                 |
| `react-native` | `<div />` | `<div />`                    | `.js`                 |

Anda dapat menetapkan mode ini menggunakan flag baris perintah `--jsx` atau opsi yang sesuai di file [tsconfig.json](/docs/handbook/tsconfig-json.html) Anda.

> \*Catatan: Anda dapat menentukan fungsi factory JSX yang akan digunakan saat menargetkan react JSX emit dengan opsi `--jsxFactory` (nilai bawaan ke `React.createElement`)

## Opeartor `as`

Ingat bagaimana menulis penegasan tipe:

```ts
var foo = <foo>bar;
```

Ini menegaskan variabel `bar` memiliki tipe `foo`.
Sejak TypeScript juga menggunakan kurung siku untuk penegasan tipe, mengkombinasikannya dengan sintaks JSX akan menimbulkan kesulitan tertentu. Hasilnya, TypeScript tidak membolehkan penggunaan kurung siku untuk penegasan tipe pada file `.tsx`.

Karena sintaks diatas tidak bisa digunakan pada file `.tsx`, maka alternatif untuk penegasan tipe dapat menggunakan operator `as`.
Contohnya dapat dengan mudah ditulis ulang dengan operator `as`.

```ts
var foo = bar as foo;
```

Operator `as` tersedia dikedua jenis file, `.ts` dan `.tsx`, dan memiliki perlakuan yang sama seperti penegasan tipe menggunakan kurung siku.

## Pemeriksaan Tipe

Urutan yang harus dimengerti mengenai pemeriksaan tipe di JSX, yaitu pertama Anda harus memahami perbedaan antara elemen intrinsik dan elemen berbasiskan nilai. Terdapat sebuah ekspresi `<expr />` dan `expr` yang mungkin mengacu pada suatu hal yang intrinsik pada suatu lingkungan (misalnya `div` atau `span` dalam lingkungan DOM) atau pada komponen custom yang telah Anda buat.
Ini penting karena dua alasan berikut:

1. Untuk React, elemen intrinsik dianggap sebagai string (`React.createElement("div")`), sedangkan komponen yang Anda buat bukan (`React.createElement(MyComponent)`).
2. Type dari atribut yang dilewatkan ke elemen JSX seharusnya terlihat berbeda.
   Atribut elemen intrinsik seharusnya diketahui _secara intrinsik_ sedangkan komponen akan seperti ingin untuk menentukan kumpulan atribut mereka sendiri.

TypeScript menggunakan [beberapa convention yang dengan React](http://facebook.github.io/react/docs/jsx-in-depth.html#html-tags-vs.-react-components) untuk membedakannya.
Elemen intrinsik selalu dimulai dengan huruf kecil, dan elemen berbasiskan nilai selalu dimulai dengan huruf besar.

## Elemen intrinsik

Elemen intrinsik dicari pada interface khusus, yaitu `JSX.IntrinsicElements`.
Standarnya, jika interface ini tidak ditentukan, maka apapun yang terjadi dan elemen intrinsik tidak akan diperiksa tipenya.
Namun, jika interface ini ada, maka nama elemen intrinsik akan dicari sebagai properti di interface `JSX.IntrinsicElements`.
Contohnya:

```ts
declare namespace JSX {
  interface IntrinsicElements {
    foo: any;
  }
}

<foo />; // ok
<bar />; // galat
```

Pada contoh diatas, `<foo />` akan berjalan dengan baik, tapi `<bar />` akan menghasilkan galat, karena `<bar />` tidak ditentukan pada interface `JSX.IntrinsicElements`.

> Catatan: Anda juga bisa menentukan indexer untuk mendapatkan seluruh elemen bertipe string didalam `JSX.IntrinsicElements`, seperti berikut:

```ts
declare namespace JSX {
  interface IntrinsicElements {
    [elemName: string]: any;
  }
}
```

## Elemen Berbasiskan Nilai

Elemen berbasiskan nilai akan dicari oleh identifier yang ada pada sebuah scope.

```ts
import MyComponent from "./myComponent";

<MyComponent />; // ok
<SomeOtherComponent />; // galat
```

Terdapat dua cara untuk mendefinisikan sebuah elemen berbasiskan nilai, yaitu:

1. Function Component (FC)
2. Class Component

Karena kedua jenis elemen berbasis nilai ini tidak dapat dibedakan satu sama lain dalam ekspresi JSX, maka pertama TS akan mencoba menyelesaikan ekspresi tersebut sebagai Function Component menggunakan overloading. Jika proses berhasil, maka TS selesai menyelesaikan ekspresi ke deklarasinya. Jika gagal untuk menyelesaikan sebagai Function Component, maka TS kemudian akan mencoba untuk menyelesaikannya sebagai Class Component. Jika gagal, TS akan melaporkan kesalahan.

### Function Component

Seperti namanya, komponen ini didefinisikan menggunakan fungsi JavaScript dimana argumen pertamanya adalah sebuah `props` objek.
TS memberlakukan bahwa tipe kembaliannya harus dapat diberikan ke `JSX.Element`.

```ts
interface FooProp {
  name: string;
  X: number;
  Y: number;
}

declare function AnotherComponent(prop: {name: string});
function ComponentFoo(prop: FooProp) {
  return <AnotherComponent name={prop.name} />;
}

const Button = (prop: {value: string}, context: { color: string }) => <button>
```

Karena Function Component adalah fungsi JavaScript, maka fungsi overload dapat digunakan di sini:

```ts
interface ClickableProps {
  children: JSX.Element[] | JSX.Element
}

interface HomeProps extends ClickableProps {
  home: JSX.Element;
}

interface SideProps extends ClickableProps {
  side: JSX.Element | string;
}

function MainButton(prop: HomeProps): JSX.Element;
function MainButton(prop: SideProps): JSX.Element {
  ...
}
```

> Catatan: Function Component sebelumnya dikenal sebagai Stateless Function Component (SFC). Karena Function Component tidak dapat lagi dianggap stateless di versi terbaru react, jenis `SFC` dan aliasnya`StatelessComponent` tidak digunakan lagi.

### Class Component

Ini memungkinkan untuk mendefinisikan tipe dari class component.
Namun, untuk melakukannya, yang terbaik adalah memahami dua istilah baru berikut: _type class elemen_ dan _type instance elemen_.

Jika terdapat `<Expr />`, maka _type class elemennya_ adalah `Expr`.
Jadi pada contoh diatas, jika `MyComponent` adalah class ES6, maka tipe class-nya adalah konstruktor dan static dari class tersebut.
Jika `MyComponent` adalah factory function, maka tipe class-nya adalah fungsi itu sendiri.

Setelah tipe class dibuat, tipe instance ditentukan oleh gabungan tipe kembalian dari konstruksi tipe class atau call signature (mana saja yang ada).
Jadi sekali lagi, dalam kasus kelas ES6, jenis instans adalah jenis instans kelas itu, dan dalam kasus factory function, itu akan menjadi jenis nilai yang dikembalikan dari fungsi tersebut.

```ts
class MyComponent {
  render() {}
}

// menggunakan konstruksi signature
var myComponent = new MyComponent();

// tipe class elemen => MyComponent
// tipe instance elemen => { render: () => void }

function MyFactoryFunction() {
  return {
    render: () => {},
  };
}

// menggunakan call signature
var myComponent = MyFactoryFunction();

// tipe class elemen => FactoryFunction
// tipe instance elemen => { render: () => void }
```

Tipe elemen instance itu menarik, karena ini harus dapat di-assign ke `JSX.ElementClass` atau hasilnya akan galat.
Standarnya `JSX.ElementClass` adalah `{}`, tetapi ini bisa ditambah untuk membatasi penggunaan JSX hanya untuk jenis yang sesuai dengan interface yang tepat.

```ts
declare namespace JSX {
  interface ElementClass {
    render: any;
  }
}

class MyComponent {
  render() {}
}
function MyFactoryFunction() {
  return { render: () => {} };
}

<MyComponent />; // ok
<MyFactoryFunction />; // ok

class NotAValidComponent {}
function NotAValidFactoryFunction() {
  return {};
}

<NotAValidComponent />; // galat
<NotAValidFactoryFunction />; // galat
```

## Pemeriksaan Tipe Atribut

Langkah pertama untuk memeriksa tipe atribut adalah menentukan tipe atribut elemen.
Ini sedikit berbeda antara elemen intrinsik dan berbasis nilai.

Untuk elemen intrinsik, ini adalah tipe dari properti pada `JSX.IntrinsicElements`

```ts
declare namespace JSX {
  interface IntrinsicElements {
    foo: { bar?: boolean };
  }
}

// tipe atribut elemen untuk 'foo' is '{bar?: boolean}'
<foo bar />;
```

Untuk elemen berbasis nilai, ini sedikit lebih kompleks.
Ini ditentukan oleh tipe dari properti pada _type elemen instance_ yang telah ditentukan.
Property mana yang digunakan untuk ditentukan oleh `JSX.ElementAttributesProperty`.
Ini harus dideklarasikan dengan satu properti.
Nama properti itu kemudian digunakan.
Mulai TypeScript 2.8, jika `JSX.ElementAttributesProperty` tidak disediakan, jenis parameter pertama dari konstruktor elemen kelas atau pemanggilan Function Component akan digunakan sebagai gantinya.

```ts
declare namespace JSX {
  interface ElementAttributesProperty {
    props; // menentukan nama properti yang akan digunakan
  }
}

class MyComponent {
  // menentukan properti pada tipe instance elemen
  props: {
    foo?: string;
  };
}

// tipe atribut elemen untuk 'MyComponent' adalah '{foo?: string}'
<MyComponent foo="bar" />;
```

Type atribut elemen digunakan untuk memeriksa atribut di JSX.
Properti opsional dan wajib telah didukung.

```ts
declare namespace JSX {
  interface IntrinsicElements {
    foo: { requiredProp: string; optionalProp?: number };
  }
}

<foo requiredProp="bar" />; // ok
<foo requiredProp="bar" optionalProp={0} />; // ok
<foo />; // galat, tidak ada requiredProp
<foo requiredProp={0} />; // galat, requiredProp seharusnya bertipe string
<foo requiredProp="bar" unknownProp />; // galat, unknownProp tidak ada
<foo requiredProp="bar" some-unknown-prop />; // ok, karena 'some-unknown-prop' bukan identifier yang valid
```

> Catatan: Jika nama atribut bukan identifier JS yang valid (seperti atribut `data- *`), itu tidak dianggap sebagai kesalahan jika tidak ditemukan dalam tipe atribut elemen.

Selain itu, antarmuka `JSX.IntrinsicAttributes` dapat digunakan untuk menentukan properti tambahan yang digunakan oleh framework JSX yang umumnya tidak digunakan oleh props atau argumen komponen - misalnya `key` di React. Mengkhususkan lebih lanjut, tipe generik `JSX.IntrinsicClassAttributes<T>` juga dapat digunakan untuk menetapkan tipe atribut tambahan yang sama hanya untuk class component (dan bukan function component). Dalam tipe ini, parameter generik sesuai dengan tipe instance class. Di React, ini digunakan untuk mengizinkan atribut `ref` dengan tipe `Ref <T>`. Secara umum, semua properti pada interface ini harus bersifat opsional, kecuali Anda bermaksud agar pengguna framework JSX Anda perlu menyediakan beberapa atribut pada setiap tag.

Spread operator juga bekerja:

```ts
var props = { requiredProp: "bar" };
<foo {...props} />; // ok

var badProps = {};
<foo {...badProps} />; // galat
```

## Pemeriksaan Type Children

Di TypeScript 2.3, TS mengenalkan pemeriksaan tipe pada _children_. _Children_ adalah properti khusus di _type atribut elemen_ dimana child _JSXExpression_ diambil untuk dimasukkan ke atribut.
Mirip dengan bagaimana menggunakan `JSX.ElementAttributesProperty` untuk menentukan nama dari _props_, TS menggunakan `JSX`.
`JSX.ElementChildrenAttribute` harus dideklarasikan dengan properti tunggal.

```ts
declare namespace JSX {
  interface ElementChildrenAttribute {
    children: {}; // menentukan nama children untuk digunakan
  }
}
```

```ts
<div>
  <h1>Hello</h1>
</div>;

<div>
  <h1>Hello</h1>
  World
</div>;

const CustomComp = (props) => <div>{props.children}</div>
<CustomComp>
  <div>Hello World</div>
  {"This is just a JS expression..." + 1000}
</CustomComp>
```

Anda bisa menentukan tipe dari _children_ seperti atribut lainnya. Ini akan mengganti tipe standarnya, misalnya [React typings](https://github.com/DefinitelyTyped/DefinitelyTyped/tree/master/types/react) jika Anda menggunakannya.

```ts
interface PropsType {
  children: JSX.Element
  name: string
}

class Component extends React.Component<PropsType, {}> {
  render() {
    return (
      <h2>
        {this.props.children}
      </h2>
    )
  }
}

// OK
<Component name="foo">
  <h1>Hello World</h1>
</Component>

// Error: children adalah tipe JSX.Element, bukan array dari JSX.Element.
<Component name="bar">
  <h1>Hello World</h1>
  <h2>Hello World</h2>
</Component>

// Error: children adalah tipe JSX.Element, bukan array dari JSX.Element maupun string.
<Component name="baz">
  <h1>Hello</h1>
  World
</Component>
```

## Type hasil JSX

Secara standar, hasil dari ekspresi JSX bertipe `any`.
Anda bisa menyesuaikan tipe dengan menentukan interface `JSX.Element`.
Namun, tidak mungkin untuk mengambil informasi tipe tentang elemen, atribut atau turunan dari JSX dari interface ini.
Itu adalah black box.

## Menyematkan Ekspresi

JSX memungkinkan Anda untuk menyematkan ekspresi di antara tag dengan mengapit ekspresi dengan kurung kurawal (`{}`).

```ts
var a = (
  <div>
    {["foo", "bar"].map((i) => (
      <span>{i / 2}</span>
    ))}
  </div>
);
```

Kode di atas akan menghasilkan kesalahan karena Anda tidak dapat membagi string dengan angka.
Outputnya, saat menggunakan opsi `preserve`, terlihat seperti:

```ts
var a = (
  <div>
    {["foo", "bar"].map(function (i) {
      return <span>{i / 2}</span>;
    })}
  </div>
);
```

## Integrasi React

Untuk menggunakan JSX dengan React, Anda harus menggunakan [React typings](https://github.com/DefinitelyTyped/DefinitelyTyped/tree/master/types/react). Typings ini mendefinisikan namespace `JSX` dengan tepat untuk digunakan dengan React.

```ts
/// <reference path="react.d.ts" />

interface Props {
  foo: string;
}

class MyComponent extends React.Component<Props, {}> {
  render() {
    return <span>{this.props.foo}</span>;
  }
}

<MyComponent foo="bar" />; // ok
<MyComponent foo={0} />; // galat
```

## Factory Function

Factory function yang digunakan oleh opsi kompilator `jsx: react` dapat dikonfigurasi. Ini dapat disetel menggunakan opsi baris perintah `jsxFactory`, atau komentar `@jsx` sebaris untuk menyetelnya pada basis per file. Misalnya, jika Anda menyetel `jsxFactory` ke `createElement`, `<div />` akan melakukannya sebagai `createElement("div")` bukan `React.createElement("div")`.

Versi pragma komentar dapat digunakan seperti itu (dalam TypeScript 2.8):

```ts
import preact = require("preact");
/* @jsx preact.h */
const x = <div />;
```

akan menjadi:

```ts
const preact = require("preact");
const x = preact.h("div", null);
```

Factory yang dipilih juga akan mempengaruhi di mana namespace `JSX` dicari (untuk informasi pemeriksaan tipe) sebelum kembali ke global. Jika factory ditentukan sebagai `React.createElement` (standar), kompilator akan memeriksa `React.JSX` sebelum memeriksa `JSX` global. Jika factory ditentukan sebagai `h`, maka ia akan memeriksa `h.JSX` sebelum `JSX` global.
