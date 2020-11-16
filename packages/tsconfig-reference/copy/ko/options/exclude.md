---
display: "Exclude"
oneline: "Filters results from the `include` option."
---

`include` 에서 파일을 포함할 때 생략할 파일 이름이나 패턴을 배열로 지정합니다.

**중요** : `exclude` 는 _오직_ `include` 의 설정의 결과로 포함되는 파일만 변경합니다. `exclude` 로 지정된 파일은 코드상의 `types`를 포함하여, `import`에 의해 코드 베이스의 일부가 될 수 있습니다. 이는 `/// <reference` 지시문 또는 `files` 목록에 지정되어 있기 때문입니다.


이것은 파일이 코드 베이스에 포함되는 것을 **방지**하는 메커니즘이 아닙니다. 단순히 `include`의 설정이 찾은 내용만을 변경하게 됩니다.
