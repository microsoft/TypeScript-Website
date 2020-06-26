// 类型联合 （Type unions）是用来定义一个对象可能为多个类型的情况。

type StringOrNumber = string | number;
type ProcessStates = "open" | "closed";
type OddNumbersUnderTen = 1 | 3 | 5 | 7 | 9;
type AMessyUnion = "hello" | 156 | { error: true };

// 如果你不了解 "open"、"closed" 等字符串的用法，可以
// 查看 example:literals

// 我们可以将多个不同的类型混合到一个并集类型中，
// 我们把他称为 “这个值的类型是这些类型之一”。

// 然后 TypeScript 将会让您确认在运行时如何确定它是哪个类型的值。

// 并集类型有时可能被类型扩展而破坏，例如：

type WindowStates = "open" | "closed" | "minimized" | string;

// 如果你将鼠标悬停在上方，你可以看到 WindowStates 变为了
// 一个字符串而不是一个并集类型。可以在这里查看：example:type-widening-and-narrowing

// 如果说并集类型代表 “或”，那么交集类型代表 “且”。
// 交集类型代表两个类型相交以创建一个新类型，这将会允许类型的组合。

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

// 这些接口由响应组合而成，他们既可以具有统一的错误处理，
// 又可以具有自己的数据。

type ArtworksResponse = ArtworksData & ErrorHandling;
type ArtistsResponse = ArtistsData & ErrorHandling;

// 例如：

const handleArtistsResponse = (response: ArtistsResponse) => {
  if (response.error) {
    console.error(response.error.message);
    return;
  }

  console.log(response.artists);
};

// 当对象必须含有下面的一个或两个值时，交集和并集类型的混合将会非常有用。

interface CreateArtistBioBase {
  artistID: string;
  thirdParty?: boolean;
}

type CreateArtistBioRequest = (CreateArtistBioBase & { html: string }) | { markdown: string };

// 现在您只有在包含 artistID 和（html 或 markdown）时
// 您才能创建对应的请求。

const workingRequest: CreateArtistBioRequest = {
  artistID: "banksy",
  markdown: "Banksy is an anonymous England-based graffiti artist...",
};

const badRequest: CreateArtistBioRequest = {
  artistID: "banksy",
};
