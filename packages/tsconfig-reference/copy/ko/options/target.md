---
display: "Target"
oneline: "Set the JavaScript language version for emitted JavaScript and include compatible library declarations."
---

최신 브라우저는 모든 ES6 기능을 지원하므로 `ES6`는 좋은 선택입니다.
만약 코드가 이전 환경에서 배포된 경우라면 더 낮은 버전을, 최신 환경에서 실행이 보장되는 경우 더 높은 버전을 선택할 수 있습니다.

`target` 설정은 하향 평준화된 JS 기능과 온전히 남아있는 것을 변경합니다.
예를 들어 `target`이 ES5 이하인 경우, 화살 함수 `() => this`는 동등한 `function` 표현식으로 바뀝니다.

`target`을 바꾼다는 것은 마찬가지로 [`lib`](#lib)의 기본값을 바꿉니다.
원하는 대로 `target` 및 `lib` 설정을 "믹스 앤 매치" 할 수 있지만, 편의를 위해 `target`만 설정할 수 있습니다.

Node와 같은 개발자 플랫폼의 경우 버전에 따라 대상에 대한 특정 기준이 있습니다. [tsconfig/bases](https://github.com/tsconfig/bases#centralized-recommendations-for-tsconfig-bases)에서 공통 플랫폼 및 해당 버전에 대한 커뮤니티 구성 TSConfig 세트를 찾을 수 있습니다.

`ESNext` 값은 특별하게 TypeScript가 지원하는 가장 높은 버전을 나타냅니다.
이 설정은 TypeScript 버전과 같다는 것을 의미하는 것이 아니며 업그레이드 예측 가능성을 낮출 수 있으므로 주의해야 합니다.
