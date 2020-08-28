---
display: "Opciones de Vigilancia"
---

TypeScript 3.8 lanzó una nueva estrategia para analizar los directorios, que es crucial para detectar eficientemente los cambios en los `node_modules`.

En sistemas operativos como Linux, TypeScript instala vigilantes de directorios (a diferencia de vigilantes de archivos) en `node_modules` y muchos de sus subdirectorios para detectar cambios en las dependencias.
Esto se debe a que el número de vigilantes de archivos disponibles es a menudo eclipsado por el de archivos en `node_modules`, mientras que hay muchos menos directorios que rastrear.

Debido a que cada proyecto podría funcionar mejor bajo diferentes estrategias, y este nuevo enfoque podría no funcionar bien para sus flujos de trabajo, TypeScript 3.8 introduce un nuevo campo `watchOptions` que permite a los usuarios indicar al compilador/servicio lingüístico qué estrategias de vigilancia deben ser utilizadas para mantener el seguimiento de los archivos y directorios.
