//// { compiler: { ts: "4.0.0-beta" } }

// Por causa do Javascript permitir o uso de qualquer valor,
// o TypeScript não permite a declaração um tipo de erro.

try {
  // ..
} catch (e) {}

// Historicamente, isso significava que o `e` no catch
// poreria ter qualquer valor. Isso permitia liberdade para qualquer
// acesso arbitrariamente de qualquer propriedade. Com o 4.0, nós soltamos
// as restrinções do tipo configurado no clausula catch para permitir ambos
// `qualquer`(any) e `desconhecido` ( unknow).

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

  // Você não pode usar `e` para todos os sistemas
  // de tipos até aprender o que são, para mais informação
  // a respeito: veja:
  // exemplo:desconhecido-e-nunca
  
  e.stack;

  if (e instanceof SyntaxError) {
    e.stack;
  }
}
