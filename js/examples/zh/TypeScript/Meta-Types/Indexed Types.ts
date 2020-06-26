// 有时候您会发现自己在实现重复的类型。一个常见的
// 例子是自动生成的 API 响应中的嵌套资源。

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

// 如果接口是手工实现的，那么很容易会想到将 artworks 提取到一个接口中，类似于：

interface Artwork {
  name: string;
  deathdate: string | null;
  bio: string;
}

// 但是在这种情况下，我们无法控制 API，并且如果我们手动创建了接口，
// 当响应的类型更改时，ArtworkSearchResponse 的
// artworks 部分 和 Artwork 可能不同步。

// 解决此问题的方法是索引类型（indexed types），它与 JavaScript 可以
// 通过字符串访问属性的方式相同。

type InferredArtwork = ArtworkSearchResponse["artists"][0]["artworks"][0];

// InferredArtwork 由查找属性并将新名称赋予被索引的类型的对应子集而得到。
