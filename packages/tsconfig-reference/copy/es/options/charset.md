---
display: "Charset"
oneline: "Sin soporte. En versiones anteriores, manualmente guarda la codificación del texto para leer archivos."
---

En versiones anteriores de TypeScript, esto controlaba que tipo de codificación era usada para leer archivos de texto del disco duro.
Ahora, TypeScript asume codificación UTF-8, pero detectará correctamente UTF-16 (BE y LE) o BOMs UTF-8.
