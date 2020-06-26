//// { compiler: {  }, order: 1 }

// 3.7では、const変数の値が再代入されたときに、素早くletに変換する機能が追加されました。

// 以下のエラーをハイライトして、クイックフィックスを実行することで試すことができます。

const displayName = 'Andrew'

displayName = 'Andrea'
