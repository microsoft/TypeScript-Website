// 重複した型に気付く場合があります。
// よくある例は自動生成されたAPIレスポンスの
// ネストされたリソースです。

interface ArtworkSearchResponse {
  artists: {
    name: string;
    artworks: {
      name: string;
      deathdate: string | null;
      bio: string;
    }[];
  }[];
}

// もし、このinterfaceが手動で作られていたら、
// 以下のようにartworksからinterfaceを抜き出してくることはとても簡単です。

interface Artwork {
  name: string;
  deathdate: string | null;
  bio: string;
}

// しかし、この場合、APIをいじることはできません。
// 手動でinterfaceをArtworkSearchResponseの
// 一部であるartworksとして定義することも可能ですが、
// するとArtwork型はレスポンスが変更されたときに同期されません。

// これに対する工夫はJavaScriptが
// 文字列でプロパティにアクセスする際に用いる手法の複製であるindexed typeです

type InferredArtwork = ArtworkSearchResponse["artists"][0]["artworks"][0];

// InferredArtworkは
// 型のプロパティを見通して作成され、
// 指し示した部分集合に対して新しい名前を与えます。
