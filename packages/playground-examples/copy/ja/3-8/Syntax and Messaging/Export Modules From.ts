//// { compiler: { ts: "3.8.3" } }
// TypeScriptの再エクスポート機能が、ES2018で
// 利用可能なより多くのケースをサポートするようになりました。
//
// JavaScriptのエクスポートには、依存関係の一部を
// 簡潔に再エクスポートする機能があります:

export { ScriptTransformer } from "@jest/transform";

// 以前のバージョンのTypeScriptでは、
// オブジェクト全体をエクスポートしたい場合には
// すこし冗長でした:

import * as console from "@jest/console";
import * as reporters from "@jest/reporters";

export { console, reporters };

// 3.8では、TypeScriptはより多くのJavaScriptの仕様にある
// エクスポート文の形をサポートすることで、
// 1行でモジュールを再エクスポートできるようになりました。

export * as jestConsole from "@jest/console";
export * as jestReporters from "@jest/reporters";
