//// { compiler: { ts: "3.8.3" } }

// Kemampuan TypeScript untuk mengekspor ulang menjadi lebih dekat
// pada kasus tambahan yang terdapat pada ES2018
//
// Ekspor pada JavaScript mempunyai kemampuan untuk mengekspor
// ulang sebuah bagian dari _dependency_ secara elegan:

export { ScriptTransformer } from "@jest/transform";

// Ketika Anda ingin mengekspor seluruh objek, hal
// tersebut menjadi agak sedikit berlebih pada TypeScript
// versi sebelumnya:

import * as console from "@jest/console";
import * as reporters from "@jest/reporters";

export { console, reporters };

// Pada TypeScript versi 3.8, TypeScript mendukung
// lebih banyak ekspresi ekspor dibandingkan spesifikasi
// JavaScript, dimana hal tersebut memperbolehkan Anda
// untuk menulis ekspresi ekspor ulang sebuah modul
// hanya dengan satu baris saja

export * as jestConsole from "@jest/console";
export * as jestReporters from "@jest/reporters";
