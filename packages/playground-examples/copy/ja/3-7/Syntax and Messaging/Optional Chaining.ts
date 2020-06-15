//// { compiler: {  }, order: 1 }

// オプショナルチェイニングは3.7の開発中にTC39のStage 3合意に達しました。
// オプショナルチェイニングによって
// nullまたはundefinedだったときに
// 式の実行を即座に止めるコードが書けるようになります。

// プロパティへのアクセス

// データの中にアーティストそのものの情報やアーティストのプロフィールがない可能性がある
// アルバム情報を想像してみましょう。例えば、コンピレーションアルバムは
// 単一のアーティストについての情報を持っていないでしょう。

type AlbumAPIResponse = {
  title: string;
  artist?: {
    name: string;
    bio?: string;
    previousAlbums?: string[];
  };
};

declare const album: AlbumAPIResponse;

// オプショナルチェイニングを用いると、
// コードは以下のように書けます。

const artistBio = album?.artist?.bio;

// 以下のように書く代わりに:

const maybeArtistBio = album.artist && album.artist.bio;

// 演算子は"falsy"な値(例えば、空文字列や0、NaN、もちろんfalse)に
// 対して異なる振る舞いをするため、
// この場合、?.演算子は&&演算子とは異なる振る舞いをします。

// オプショナルチェイニングはnullまたはundefinedのみを
// 処理を止め、undefinedを返す合図と捉えます。

// オプショナルな要素へのアクセス

// プロパティへのアクセスは .演算子を用いて行われます。
// オプショナルチェイニングは要素にアクセス際の[]演算子でも同様に機能します。

const maybeArtistBioElement = album?.["artist"]?.["bio"];

const maybeFirstPreviousAlbum = album?.artist?.previousAlbums?.[0];

// オプショナルな呼び出し

// オプショナルチェイニングは、実行時に存在するか分からない関数を扱うときに、
// 関数が存在するときにだけ呼び出す機能をサポートしています。
// これによって、伝統的に書いていた次のような
// コードを置き換えられます: if (func) func()

// 以下はAPI requestからのcallbackに対する
// オプショナルな呼び出しの例です。

const callUpdateMetadata = (metadata: any) => Promise.resolve(metadata); // API呼び出しのダミー

const updateAlbumMetadata = async (metadata: any, callback?: () => void) => {
  await callUpdateMetadata(metadata);

  callback?.();
};

// 3.7のリリース記事にて、オプショナルチェイニングについてより詳細に知ることができます:
//
// https://devblogs.microsoft.com/typescript/announcing-typescript-3-7/
