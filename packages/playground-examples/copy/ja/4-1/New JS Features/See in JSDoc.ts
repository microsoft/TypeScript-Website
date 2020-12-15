//// { compiler: { ts: "4.1.0-beta" } }

// 4.1では、TypeScriptとJavaScriptファイルの両方で
// 使われているTypeScriptのJSDocパーサが
// @seeパラメータをサポートします。

// @seeを使えば、クリック(cmd/ctrl + クリック)するか、
// あるいはマウスをホバーした時に表示される情報から
// 関連するコードに素早くアクセスすることができます。

/**
 * @see hello
 */
const goodbye = "Good";

/**
 * You say hi, I say low
 *
 * @see goodbye
 */
const hello = "Hello, hello";
