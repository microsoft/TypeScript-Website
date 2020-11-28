//// { compiler: {  }, order: 1 }

// 3.7ではif文の中で誤って
// 関数の戻り値の代わりに関数そのものを使っていないかを
// 検出する機能が追加されました。

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
  // pluginShouldLoadが存在する場合の処理
}

// 3.6以前で以下はエラーではありませんでした。

if (plugin.pluginIsActivated) {
  // プラグインが有効化されていた場合になにか処理を
  // 行おうとしていますが、関数を呼び出すのではなく
  // プロパティとして使用しています。
}

// pluginIsActivatedは常に存在しているはずですが、
// ifブロックの中でメソッドが呼び出されるため、
// TypeScriptはこのチェックを許可しています。

if (plugin.pluginIsActivated) {
  plugin.pluginIsActivated();
}
