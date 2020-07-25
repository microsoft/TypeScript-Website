//// { compiler: { ts: "3.8.3" } }
// 以前のバージョンのTypeScriptでは、
// インデックスシグネチャを含む共用体に宣言されていないフィールドについて
// 型チェックが行われませんでした。

// インデックスシグネチャについてはこちら: example:indexed-types

// 例えば、以下のIdentifierCacheは、
// オブジェクトのすべてのキーが、numberであることを表しています。

type IdentifierCache = { [key: string]: number };

// つまり、以下の例は型チェックエラーとなります。
// 'file_a'のキーにstringの値が設定されているためです。

const cacheWithString: IdentifierCache = { file_a: "12343" };

// しかし、IdentifierCacheを共用体に含めると、
// 以前は、型チェックが行われませんでした。

let userCache: IdentifierCache | { index: number };
userCache = { file_one: 5, file_two: "abc" };

// こちらが修正され、コンパイラーから
// 'file_two'のキーについてのエラーが出るようになりました。

// この型チェックは、キーの型が異なる場合も考慮に入れられています。
// 例: ([key: string] and [key: number])

type IdentifierResponseCache = { [key: number]: number };

let resultCache: IdentifierCache | IdentifierResponseCache;
resultCache = { file_one: "abc" };
