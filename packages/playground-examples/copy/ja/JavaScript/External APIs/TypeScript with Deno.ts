//// { order: 3 }

// Denoはセキュリティに重点を置いた開発中のv8ベースの
// JavaScript及びTypeScriptのランタイムです。

// https://deno.land

// Denoはサンドボックスベースの権限システムを採用しており、JavaScript
// がファイルシステムやネットワークへのアクセスを減らし、httpベースの
// インポートを使用してダウンロードしローカルにキャッシュしています。

// 以下はdenoを使用した例をです:

import compose from "https://deno.land/x/denofun/lib/compose.ts";

function greet(name: string) {
  return `Hello, ${name}!`;
}

function makeLoud(x: string) {
  return x.toUpperCase();
}

const greetLoudly = compose(makeLoud, greet);

// 出力 "HELLO, WORLD!."
greetLoudly("world");

import concat from "https://deno.land/x/denofun/lib/concat.ts";

// 戻り値 "helloworld"
concat("hello", "world");
