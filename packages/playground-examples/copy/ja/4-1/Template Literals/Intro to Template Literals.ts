//// { compiler: { ts: "4.1.0-dev.20201028" } }

// TypeScriptでは、すでに厳密な文字列/数値をリテラルとして
// 扱うことができます。例えば、次の関数は厳密な文字列を
// 2つだけ許可し、それ以外は許可しません。

declare function enableFeature(command: "redesign" | "newArtistPage"): void;
enableFeature("redesign");
enableFeature(`newArtistPage`);
enableFeature("newPaymentSystem");

// 文字列リテラルはES2020で記述できるすべての文字列の記述方法をサポートしています。
// さらに、TypeScript 4.1では、サポートを拡張し、
// テンプレート文字列リテラルへの文字列挿入ができるようになりました。

type Features = "Redesign" | "newArtistPage";

// 次の型は上記のUnion型であるFeaturesを使用し、
// Union型の各要素を変換して文字列の後ろに`-branch`を追加します。
type FeatureBranch = `${Features}-branch`;

// 4.1では、文字列を操作するためにテンプレートリテラル内で使用できる
// ジェネリクスのような新しいキーワードのセットをサポートしています。
// そのキーワードとは、Uppercase、Lowercase、Capitalize、Uncapitalizeです。

type FeatureID = `${Lowercase<Features>}-id`;
type FeatureEnvVar = `${Uppercase<Features>}-ID`;

// Union型を構成する文字列は掛け合わされます。
// したがって、複数のUnion型を使用した場合、Union型を構成するそれぞれの型は、
// 他のUnion型を構成するそれぞれの型に対して評価されます。

type EnabledStates = "enabled" | "disabled";
type FeatureUIStrings = `${Features} is ${EnabledStates}`;

// このことにより、それぞれのUnion型の要素の
// すべての可能な組み合わせが考慮されることが保証されます。

// 次の型では、インデックスシグネチャと併用することで
// プロパティキーのリストを素早く作成することができます。

type SetFeatures = {
  [K in FeatureID]: boolean
};

// テンプレートリテラルについて続けて学ぶ場合はこちらを参照してください:
// example:mapped-types-with-template-literals

// もしくはこちらの告知ブログ記事をご覧ください:
// https://devblogs.microsoft.com/typescript/announcing-typescript-4-1-beta/#template-literal-types
