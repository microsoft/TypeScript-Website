---
display: "Strict"
oneline: "Enable all strict type checking options."
---

`strict` 플래그는 다양한 타입 검사를 가능하게 하여 프로그램 정확성을 더욱 보장합니다.
strict 플래그를 켜는 것은 아래에 설명된 모든 _strict mode family_ 옵션을 활성화하는 것과 같습니다.
필요에 따라 개별 strict mode family 검사를 끌 수 있습니다.

향후 버전의 TypeScript는 이 플래그에서 추가적인 엄격한 검사를 도입할 수 있어, TypeScript를 업그레이드하면 프로그램에 새로운 타입 오류가 발생할 수도 있습니다.
적당히 가능할 때, 해당 플래그를 추가하여 동작을 비활성화합니다.
