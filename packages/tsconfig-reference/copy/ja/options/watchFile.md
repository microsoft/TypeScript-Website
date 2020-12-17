---
display: "watchFile"
oneline: "What technique should the watcher use"
---

個々のファイルを監視する方法を指定します。

- `fixedPollingInterval`: すべてのファイルの変更を一定間隔で毎秒数回チェックします。
- `priorityPollingInterval`: すべてのファイルの変更を毎秒数回チェックしますが、ヒューリスティックスを使用して他のファイルよりも少ない頻度で特定のタイプのファイルをチェックします。
- `dynamicPriorityPolling`: 変更頻度の低いファイルがチェックされる頻度が低くなるような動的なキューを使用します。
- `useFsEvents` (デフォルト): オペレーティングシステム/ファイルシステムのネイティブイベントの使用をファイルの変更に試みます。
- `useFsEventsOnParentDirectory`: ファイルの親ディレクトリでオペレーティングシステム/ファイルシステムのネイティブイベントを使用を試み、変更をリッスンします。
