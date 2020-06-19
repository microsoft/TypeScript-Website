//// { order: 3 }

// Denoはセキュリティに重点を置いた開発中のv8ベースの
// JavaScript及びTypeScriptのランタイムです。

// https://deno.land

// DenoはJavaScriptのファイルシステムやネットワークへのアクセスを減らす
// サンドボックスベースの権限システムを採用し、
// ローカルにダウンロードとキャッシュされるhttpベースのインポートを使用します。

// 以下はdenoを使用した例です:

import compose from "https://deno.land/x/denofun/lib/compose.ts";

function greet(name: string) {
  return `Hello, ${name}!`;
}

function makeLoud(x: string) {
  return x.toUpperCase();
}

const greetLoudly = compose(makeLoud, greet);

// "HELLO, WORLD!."を出力します
greetLoudly("world");

import concat from "https://deno.land/x/denofun/lib/concat.ts";

// "helloworld"を返します
concat("hello", "world");
