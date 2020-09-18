// 共用型の識別とは
// コードフロー解析で可能性のあるオブジェクトの種類を
// 特定の1つのオブジェクトに減らすのに使うものです。
//
// このパターンは異なる文字列や数字の定数を持つ
// よく似たオブジェクトの集合に対してよく機能します。
// 例: 名前付きイベントのリストや
// バージョン付けされたオブジェクトの集合

type TimingEvent = { name: "start"; userStarted: boolean } | { name: "closed"; duration: number };

// イベントがこの関数にやってきたとき、
// 2つの型のどちらの可能性もあります。

const handleEvent = (event: TimingEvent) => {
  // event.nameに対してswitch文を用いることで、
  // TypeScriptのコードフロー解析はオブジェクトが
  // 共用型のうちの片方で表せるということを確定できます。

  switch (event.name) {
    case "start":
      // TimingEventのうち、nameが"start"になる型は1つしかないので、
      // これはuserStartedに
      // 安全にアクセスできることを意味します。
      const initiatedByUser = event.userStarted;
      break;

    case "closed":
      const timespan = event.duration;
      break;
  }
};

// このパターンは型の識別にnumber型を使った
// 場合でも同じです。

// 以下の例では、区別できる共用型に加えて
// ハンドリングする必要のあるエラーがあります。

type APIResponses = { version: 0; msg: string } | { version: 1; message: string; status: number } | { error: string };

const handleResponse = (response: APIResponses) => {
  // エラーの場合をハンドリングし、returnします。
  if ("error" in response) {
    console.error(response.error);
    return;
  }

  // TypeScriptはここではAPIResponseがエラー型にならないことを知っています。
  // もし、エラーであればこの関数はreturnされています。
  // これは、以下のresponseに
  // マウスホバーすると確認できます。

  if (response.version === 0) {
    console.log(response.msg);
  } else if (response.version === 1) {
    console.log(response.status, response.message);
  }
};

// 共用型のすべてをチェックしたかどうかを保証できるので、
// if文よりもswitch文を使うほうが良いでしょう。
// ハンドブックの中に、
// never型を使ってこのパターンを説明した章があります:

// https://www.typescriptlang.org/docs/handbook/advanced-types.html#discriminated-unions
