---
display: "Permitir Imports Sintéticos Padrão"
oneline: "Permite 'import x from y' quando um módulo não tem um export padrão"
---

Quando está ativo, `allowSyntheticDefaultImports` permite que você escreva um import como:

```ts
import React from "react";
```

Ao invés de:

```ts
import * as React from "react";
```

Quando o módulo **não** especifica um export padrão.

Isso não afeta o JavaScript que será emitido no TypeScript, somente a checagem de tipos
Essa opção traz o comportamento do TypeScript in-line com o Babel, onde código extra é emitido no final para que o uso de um export padrão seja mais ergonômico.
