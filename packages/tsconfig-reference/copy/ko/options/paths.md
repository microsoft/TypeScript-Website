---
display: "Paths"
oneline: "A set of locations to look for imports in"
---

가져오기를 `baseUrl` 과 관련된 조회 위치로 다시 매핑하는 일련의 항목으로, [handbook](/docs/handbook/module-resolution.html#path-mapping)에 `paths` 의 더 많은 coverage가 수록되어 있습니다.

`paths` 를 사용하면 Typescript가 `require`/`import` 에서 가져오기를 해결하는 방법을 선언 할 수 있습니다.

```json tsconfig
{
  "compilerOptions": {
    "baseUrl": ".", // 이 옵션은 반드시 "paths"가 명확한 경우 지정해야 합니다.
    "paths": {
      "jquery": ["node_modules/jquery/dist/jquery"] // 이 매핑은 "baseUrl"에 상대적입니다.
    }
  }
}
```

이렇게하면`import "jquery"`를 작성할 수 있고 모든 올바른 입력을 로컬에서 얻을 수 있습니다.

```json tsconfig
{
  "compilerOptions": {
    "baseUrl": "src",
    "paths": {
        "app/*": ["app/*"],
        "config/*": ["app/_config/*"],
        "environment/*": ["environments/*"],
        "shared/*": ["app/_shared/*"],
        "helpers/*": ["helpers/*"],
        "tests/*": ["tests/*"]
    },
}
```

이 경우 Typescript file resolver에 코드를 찾기 위한 custom prefix들을 지원하도록 지시할 수 있습니다.
이 패턴은 codebase 내의 긴 상대 경로를 피하고자 사용될 수 있습니다.
