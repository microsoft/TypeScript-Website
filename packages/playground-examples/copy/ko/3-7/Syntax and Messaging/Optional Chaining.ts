//// { compiler: {  }, order: 1 }

// 선택적 체이닝(Optional chaining)이
// TC39 3단계에서 합의점에 도달한 내용이 TS 3.7 입니다.
// 선택적 체이닝을 사용하면 null 또는 undefined인 코드에 도달했을 때
// 즉시 중지할 수 있는 코드를 작성할 수 있습니다.

// 프로퍼티 접근 (Property Access)

// 우리가 아티스트와 아티스트 약력이 없는
// 앨범을 가지고 있다고 가정해 보겠습니다.
// 예를 들면, 컴필레이션 앨범에는 아티스트 정보가 없습니다.

type AlbumAPIResponse = {
  title: string;
  artist?: {
    name: string;
    bio?: string;
    previousAlbums?: string[];
  };
};

declare const album: AlbumAPIResponse;

// 선택적 체이닝을 사용하면
// 다음과 같은 코드를 작성할 수 있습니다:

const artistBio = album?.artist?.bio;

// 대신에:

const maybeArtistBio = album.artist && album.artist.bio;

// 이 경우 ?.는  &&과는 다르게 동작합니다.
// 왜냐하면 &&는 "falsy" 값에 대한 동작이 다르기 때문입니다.
// (예. 빈 문자열, 0, NaN, 그리고, false)

// 선택적 체이닝은 null이거나 undefined이면
// 동작을 멈추고, undefined를 반환합니다.

// 선택적 요소 접근 (Optional Element Access)

// 프로퍼티 접근은 .연산자만을 이용하고,
// 선택적 체이닝이 요소에 접근할 때는 []연산자와 함께 이용합니다.

const maybeArtistBioElement = album?.["artist"]?.["bio"];

const maybeFirstPreviousAlbum = album?.artist?.previousAlbums?.[0];

// 선택적 호출(Optional Calls)

// 런타임 시 존재 여부를 판단하는 함수를 다룰 때,
// 선택적 체이닝은 실제로 존재하는 경우에만 함수호출을 지원합니다.
// 이는 if (func) func()와 같은
// 기존에 사용하던 코드를 대체할 수 있습니다.

// 예를 들어 API 요청에 의한 콜백 함수의 선택적 호출은
// 다음과 같습니다:

const callUpdateMetadata = (metadata: any) => Promise.resolve(metadata); // 가짜 API 호출

const updateAlbumMetadata = async (metadata: any, callback?: () => void) => {
  await callUpdateMetadata(metadata);

  callback?.();
};

// 선택적 체이닝에 대한 자세한 내용은 3.7 블로그 게시물을 통해 확인할 수 있습니다:
//
// https://devblogs.microsoft.com/typescript/announcing-typescript-3-7/
