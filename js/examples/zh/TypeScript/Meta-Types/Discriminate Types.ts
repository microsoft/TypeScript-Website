// 通过可辨识并集类型，您可以使用代码流分析将一组潜在的对象缩减为
// 某个特定的对象。
//
// 此模式对于具有不同 string 或 number 常量的相似对象集非常有效。
// 例如：具名事件列表或对象的版本集。

type TimingEvent = { name: "start"; userStarted: boolean } | { name: "closed"; duration: number };

// 当一个事件传入这个函数，它可能是潜在的两种类型之一。

const handleEvent = (event: TimingEvent) => {
  // 通过 switch 语句针对事件名（event.name）进行检查，TypeScript 的
  // 代码流分析可以确定对象只能由并集类型中的一种类型来表示。

  switch (event.name) {
    case "start":
      // 这代表您可以安全的访问 userStarted，因为 name 为 “start”
      // 仅在类型 TimingEvent 中出现。
      const initiatedByUser = event.userStarted;
      break;

    case "closed":
      const timespan = event.duration;
      break;
  }
};

// 此模式同样可以用在可辨识的数字上。

// 在这个例子中，我们有一个可辨识联合和一个额外的需要处理的错误状态。

type APIResponses = { version: 0; msg: string } | { version: 1; message: string; status: number } | { error: string };

const handleResponse = (response: APIResponses) => {
  // 处理错误的状态并返回。
  if ("error" in response) {
    console.error(response.error);
    return;
  }

  // TypeScript 现在已经清楚 APIResponse 不会是 error 类型。
  // 当它是 error 类型时，函数会被返回。你可以将鼠标悬停在下面的
  // response 上以验证这个结果。

  if (response.version === 0) {
    console.log(response.msg);
  } else if (response.version === 1) {
    console.log(response.status, response.message);
  }
};

// 您最好使用 switch 语句而不是使用 if 语句，因为您可以保证检查了
// 并集类型的所有部分。使用手册中的 never 类型也是一个好的模式：

// https://www.typescriptlang.org/docs/handbook/advanced-types.html#discriminated-unions
