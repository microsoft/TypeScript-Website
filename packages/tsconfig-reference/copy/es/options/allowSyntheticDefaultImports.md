---
display: "Permitir las importaciones sintéticas por defecto"
oneline: "Permite 'import x from y' cuando un módulo no tiene una exportación por defecto"
---

Cuando está activo, `allowSyntheticDefaultImports` le permite escribir una importación de la siguiente forma:

```ts
import React from "react";
```

en vez de:

```ts
import * as React from "react";
```

Cuando el módulo **NO** contiene una exportación por defecto.

Esto no afecta al JavaScript emitido por TypeScript, sólo para la comprobación de tipos.
Esta opción ajusta el comportamiento de TypeScript en línea con Babel, donde se emite código extra para hacer más cómoda el uso de una exportación por defecto de un módulo.
