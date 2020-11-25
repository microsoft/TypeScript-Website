//// { compiler: {  }, order: 1 }

// 3.7では、関数の戻り値の代わりに誤って関数を
// 使用してしまった場合に備えて、if文の中に
// チェック機能が追加されました。

// This only applies when the function is known
// to exist making the if statement always be true.
// これは関数が存在することがわかっていて、if文が常にtrueになる
// 場合にのみ適用されます。

// ここでは、オプションとオプションでないコールバックがある
// プラグインインターフェースの例を示します。

interface PluginSettings {
  pluginShouldLoad?: () => void;
  pluginIsActivated: () => void;
}

declare const plugin: PluginSettings;

// pluginShouldLoadは存在しない可能性があるため
// 次のチェックは正当なものとなります。

if (plugin.pluginShouldLoad) {
  // pluginShouldLoadが存在する場合のアクション
}

// 3.6以前ではこれはエラーではありませんでした。

if (plugin.pluginIsActivated) {
  // プラグインがアクティブになった場合になにかアクションを
  // 行おうとしていますが、ここではメソッドを呼び出すのではなく
  // プロパティとして使用しています。
}

// pluginIsActivatedは常に存在しているはずですが、
// ifブロックの中でメソッドが呼び出されるため、
// TypeScriptはこのチェックを許可しています。

if (plugin.pluginIsActivated) {
  plugin.pluginIsActivated();
}
