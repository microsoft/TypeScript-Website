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
// そして、もし手動でinterface作った場合に、レスポンスが変わると
// ArtworkSearchResponseのartworksと、
// Artworkの型が不整合を起こす可能性があります。

// これに対する修正方法は、indexed typeです。
// indexed typeは、JavaScriptの文字列を使ったプロパティへのアクセス方法を模倣しています。

type InferredArtwork = ArtworkSearchResponse["artists"][0]["artworks"][0];

// InferredArtworkは
// 型のプロパティを参照して作成され、
// 指し示した部分集合に対して新しい名前を与えます。
