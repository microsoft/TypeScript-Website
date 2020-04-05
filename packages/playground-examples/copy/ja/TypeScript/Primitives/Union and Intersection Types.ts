// 型共用体は、いくつかの型である可能性がある
// オブジェクトを宣言する一つの方法です。

type StringOrNumber = string | number;
type ProcessStates = "open" | "closed";
type OddNumbersUnderTen = 1 | 3 | 5 | 7 | 9;
type AMessyUnion = "hello" | 156 | { error: true };

// string型ではなく、"open"や"closed"の利用が初めてであれば、
// example:literals を参照してください。

// 共用体の中に、異なる型を混ぜあわせることができます。
// そしてある値は、それらの型のうちの1つであるということを表せます。

// そしてTypeScriptは、値が実行時にどうなり得るのか、
// 決定する余地を残してくれます。

// 共用体は、型の拡張によって損なわれることがあります。
// 例：

type WindowStates = "open" | "closed" | "minimized" | string;

// これにカーソルを合わせると、WindowStatesが
// 共用体ではなくstring型になっている様子を確認できます。
// これについて example:type-widening-and-narrowing で解説しています。

// 共用体がOR条件であるならば、交差はAND条件です。
// 交差型は、2つ以上の型が交差することで作成される、新しい型です。
// これにより型の合成が可能になります。

interface ErrorHandling {
  success: boolean;
  error?: { message: string };
}

interface ArtworksData {
  artworks: { title: string }[];
}

interface ArtistsData {
  artists: { name: string }[];
}

// これらのインターフェースは、同じエラー処理結果とそれぞれのデータ、
// 両方を持ち合わせた型合成をすることができます。

type ArtworksResponse = ArtworksData & ErrorHandling;
type ArtistsResponse = ArtistsData & ErrorHandling;

// 例：

const handleArtistsResponse = (response: ArtistsResponse) => {
  if (response.error) {
    console.error(response.error.message);
    return;
  }

  console.log(response.artists);
};

// 交差型と共用体型の組み合わせは、
// オブジェクトに2つの値のうちいずれかを含める必要がある
// といった場合に、とても役立ちます。

interface CreateArtistBioBase {
  artistID: string;
  thirdParty?: boolean;
}

type CreateArtistBioRequest = (CreateArtistBioBase & { html: string }) | { markdown: string };

// これにより、artistIDと、htmlまたはmarkdownを含んでいる
// リクエストのみを作成することができます。

const workingRequest: CreateArtistBioRequest = {
  artistID: "banksy",
  markdown: "Banksy is an anonymous England-based graffiti artist...",
};

const badRequest: CreateArtistBioRequest = {
  artistID: "banksy",
};
