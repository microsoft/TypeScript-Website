//// { compiler: { ts: "4.0.0-beta" } }

// Como o Javascript permite o `throw` de qualquer valor,
// o TypeScript não permite a declaração um tipo de erro.

try {
  // ..
} catch (e) {}

// Historicamente, isso significava que o `e` no catch
// poderia ter qualquer valor. Isso permitia liberdade para
// acesso arbitrário de qualquer propriedade. Com o 4.0, nós afrouxamos
// as restrições do tipo configurado no cláusula catch para permitir ambos
// `qualquer`(any) e `desconhecido` (unknown).

// Mesmo comportamento com:
try {
  // ..
} catch (e: any) {
  e.stack;
}

// Comportamento explícito com desconhecido:

try {
  // ..
} catch (e: unknown) {

  // Você não pode usar `e` até que o sistema
  // de tipos aprenda o que é. Para mais informação
  // a respeito, veja o exemplo:
  // example:unknown-and-never
  
  e.stack;

  if (e instanceof SyntaxError) {
    e.stack;
  }
}
