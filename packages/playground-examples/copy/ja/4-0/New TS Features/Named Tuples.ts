//// { compiler: { ts: "4.0.2" } }
// タプルは型システムにとって順序が重要な配列です。
// example:tuplesでタプルについてもっと詳しく学ぶことができます。

// TypeScript 4.0では、タプル型において、配列の様々な部分に名前をつけることが
// できるようになりました。

// 例えば、以前はタプルを使って次のように緯度経度を書いていました:

type OldLocation = [number, number]

const locations: OldLocation[] = [
    [40.7144, -74.006],
    [53.6458, -1.785]
]

// どちらが緯度でどちらが経度なのか、わかり辛いので
// このタプルをLatLongと名付けたほうがよかったかもしれません。

// 4.0では次のように記述できます:

type NewLocation = [lat: number, long: number]

const newLocations: NewLocation[] = [
    [52.3702, 4.8952],
    [53.3498, -6.2603]
]

// 次の行の最後にある0と1にマウスをホバーすると
// エディタに名前が表示されるようになりました
const firstLat = newLocations[0][0]
const firstLong = newLocations[0][1]

// これだけだとちょっと印象が薄いかもしれません。
// しかし、この機能が追加された主な目的は型システムを使って
// 作業する際に情報が失われないようにすることです。
// 例えば、組み込みのParameters型を使って
// 関数からパラメータを抽出する場合を考えてみましょう:

function centerMap(lng: number, lat: number) {}

// 4.0では、抽出したパラメータにlngとlatが保持されています
type CenterMapParams = Parameters<typeof centerMap>

// 3.9では、次のようになります
type OldCenterMapParams = [number, number]

// より複雑な型の操作によって、
// パラメータの情報が失われることがあります。
