---
display: "Importações não utilizadas como valores"
oneline: "Controla qual a sintaxe você utiliza para importar tipos"
---

Essa opção controla como o `import` funciona, são 3 opções diferentes:

- `remove`: O comportamento padrão para descartar os `import` que apenas referenciam tipos.

- `preserve`: Preserva todas as declarações `import` que os valores ou tipos nunca são usados. Isso pode permitir que importações/efeitos colaterais sejam mantidos.

- `error`: Isso mantém todas as importações (as mesmas que a opção de preservar), mas apresentará um erro quando o valor da importação usada for apenas como tipo. Isto pode ser útil se você quiser garantir que nenhum valor vai ser acidentalmente importado, mas ainda vai manter os efeitos colaterais da importação explícitos.

Essa opção funciona porque você pode usar `import type` para criar explicitamente uma regra `import` que nunca seja emitida em Javascript.

