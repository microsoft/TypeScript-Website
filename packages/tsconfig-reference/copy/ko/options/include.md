---
display: "Include"
oneline: "Specifies a list of glob patterns that match files to be included in compilation"
---

프로그램에 포함할 파일 이름이나 패턴을 배열로 지정합니다.
이 파일 이름은 `tsconfig.json` 파일에 포함된 디렉터리를 기준으로 하여 결정됩니다.

```json
{
  "include": ["src/**/*", "tests/**/*"]
}
```

위 문법은 아래와 같이 파일을 포함합니다.

<!-- TODO: #135
```diff
  .
- ├── scripts
- │   ├── lint.ts
- │   ├── update_deps.ts
- │   └── utils.ts
+ ├── src
+ │   ├── client
+ │   │    ├── index.ts
+ │   │    └── utils.ts
+ │   ├── server
+ │   │    └── index.ts
+ ├── tests
+ │   ├── app.test.ts
+ │   ├── utils.ts
+ │   └── tests.d.ts
- ├── package.json
- ├── tsconfig.json
- └── yarn.lock
``` -->

```
.
├── scripts                ⨯
│   ├── lint.ts            ⨯
│   ├── update_deps.ts     ⨯
│   └── utils.ts           ⨯
├── src                    ✓
│   ├── client             ✓
│   │    ├── index.ts      ✓
│   │    └── utils.ts      ✓
│   ├── server             ✓
│   │    └── index.ts      ✓
├── tests                  ✓
│   ├── app.test.ts        ✓
│   ├── utils.ts           ✓
│   └── tests.d.ts         ✓
├── package.json
├── tsconfig.json
└── yarn.lock
```

`include` 와 `exclude`는 글롭(glob) 패턴을 만들기 위한 와일드카드 문자를 지원합니다.:

- `*` 0개 혹은 그 이상의 문자를 매치합니다. (디렉터리 구분자를 제외하고)
- `?` 문자 한 개를 매치합니다. (디렉터리 구분자를 제외하고)
- `**/` 모든 하위 디렉터리를 매치합니다.

만약 글롭 패턴에 파일 확장자가 포함되어있지 않다면 오직 지원되는 확장자를 가진 파일들만 포함됩니다. (e. g. `.ts`, `.tsx`, `.d.ts`가 기본적으로 포함되며, `allowJS`가 true로 설정되었을 경우에는 `.js`, `.jsx` 까지 포함)
