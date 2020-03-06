---
display: "Charset"
oneline: "Manually set the text encoding for reading files"
---

以前のTypeScriptのバージョンでは、このオプションでディスクからどのエンコードでファイルを読み込むかを制御していました。
今のTypeScriptはUTF-8でエンコードされていることを前提としています。ただし、UTF-16（BEおよびLE）またはUTF-8のBOMを正しく検出します。
