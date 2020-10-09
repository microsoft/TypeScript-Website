---
display: "fallbackPolling"
oneline: "What the watcher should use if the system runs out of native file watchers"
---

ファイルシステムのイベントを使用するときに、システムがネイティブのファイルウォッチャーを使い切ったり、ネイティブのファイルウォッチャーが対応していない場合、どのようなポーリング戦略を行使するかを指定するオプションです。

- `fixedPollingInterval`: 一定の間隔を開けて、1 秒間に数回、全ファイルをチェックします。
- `priorityPollingInterval`: 1 秒間に数回、全ファイルをチェックします。しかし、特定の種類のファイルには発見的手法を使用して、他ファイルよりも低頻度でチェックします。
- `dynamicPriorityPolling`: 変更頻度の少ないファイルは、他よりも低頻度でチェックされるように動的キューを使用します。
- `synchronousWatchDirectory`: ディレクトリの遅延監視を無効にします。遅延監視機能は、沢山のファイル変更が一度に引き起こされる場合は役立ちますが(例： `npm install` による `node_modules` の変更)、あまり一般的な構成ではないときに、この遅延監視フラグを無効にしたくなるかもしれません。
