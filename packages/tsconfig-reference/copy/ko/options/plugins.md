---
display: "Plugins"
oneline: "Specify a list of language service plugins to include."
---

에디터 내에서 실행할 언어 서비스 플러그인 목록.

언어 서비스 플러그인은 기존 TypeScript 파일을 기반으로 사용자에게 추가 정보를 제공하는 방법입니다. TypeScript와 편집자 간의 기존 메시지를 개선하거나 자체 오류 메시지를 제공할 수 있습니다.

예를들면:

- [ts-sql-plugin](https://github.com/xialvjun/ts-sql-plugin#readme) &mdash; 템플릿 문자열 SQL 생성기로 SQL 린팅(linting)을 추가합니다.
- [typescript-styled-plugin](https://github.com/Microsoft/typescript-styled-plugin) &mdash; 템플릿 문자열 내부에 CSS 린팅(linting)을 제공합니다.
- [typescript-eslint-language-service](https://github.com/Quramy/typescript-eslint-language-service) &mdash; 컴파일러 출력 내부에 eslint 오류 메시징 및 수정 기능을 제공합니다.
- [ts-graphql-plugin](https://github.com/Quramy/ts-graphql-plugin) &mdash; GraphQL 쿼리 템플릿 문자열 내에서 검증 및 자동 완성을 제공합니다.

VS Code는 [automatically include language service plugins](https://code.visualstudio.com/api/references/contribution-points#contributes.typescriptServerPlugins)에 대한 확장 기능이 있어서, `tsconfig.json`에서 정의 할 필요없이 편집기에서 일부를 실행할 수 있습니다.
