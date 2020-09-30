---
display: "Base Url"
oneline: "Set a baseurl for relative module names"
---

절대 경로 참조가 아닌 모듈 이름을 해결하기 위한 기본 디렉터리를 설정할 수 있습니다.

절대 경로로 해결하기 위한 루트 폴더를 정의할 수도 있습니다. 예를 들면,

```
baseUrl
├── ex.ts
├── hello
│   └── world.ts
└── tsconfig.json
```

이 프로젝트에서` "baseUrl": "./"`을 사용하면, TypeScript는`tsconfig.json`과 같은 폴더에서 시작하는 파일을 찾습니다.

```ts
import { helloWorld } from "hello/world";

console.log(helloWorld);
```

항상 사용하는 `"../"` 또는 `"./"`같은 import에 질렸거나, 파일을 이동해서 변경해야 할 때,
사용할 수 있는 좋은 방법입니다.
