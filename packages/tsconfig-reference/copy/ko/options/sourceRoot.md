---
display: "Source Root"
oneline: "Sets the root path for debuggers to find the reference source code"
---

소스의 상대 위치 대신 디버거가 TypeScript 파일을 찾을 위치를 지정합니다.
이 문자열은 경로 또는 URL을 사용할 수 있는 소스-맵 내에서 그대로 처리됩니다:

```json tsconfig
{
  "compilerOptions": {
    "sourceMap": true,
    "sourceRoot": "https://my-website.com/debug/source/"
  }
}
```

`index.js` 에 `https://my-website.com/debug/source/index.ts` 위치에 소스 파일이 있다고 명시해야 합니다.
