//// { compiler: { ts: "4.0.0-beta" } }

// Operadores lógicos e terefas são novos recursos no
// JavaScript em 2020. Estes são uma suite de novos operadores
// para editar um objeto JavaScript.

// Seus objetivos são os re-usos do conceito de operadores
// matemáticos (por exemplo += -= *=) mas com lógica ao invés.


interface Usuario {
  id?: number
  nome: string
  local: {
      cep?: string
  }
}

function updateUser(usuario: Usuario) {
  // esse campo pode ser trocado
  if (!usuario.id) usuario.id = 1

  // Ou esse código:
  usuario.id = usuario.id || 1

  // Com esse código:
  usuario.id ||= 1
}

// Essas suites de operadores podem lidar com aninhamento
// profundo, na qual podem salvar de um monte códgio clichê
// também.

declare const usuario: Usuario
usuario.local.cep ||= "90210"

// There are three new operators: 
//
//   ||= shown above
//   &&= which uses 'and' logic instead of 'or'
//   ??= which builds on example:nullish-coalescing to offer a stricter
//       version of || which uses === instead

// For more info on the proposal, see:
// https://github.com/tc39/proposal-logical-assignment

// Estes são os três novos operadores:
//
// ||= mostrado acima
// &&= a qual usa 'e' logico ao invés de 'ou'
// ??= a qual nosso example se baseia: nullish-coalescing para oferecer
//       uma versão mais estrita de || que usa === em vez disso

// Para mais informações da proposta, veja:
// https://github.com/tc39/proposal-logical-assignment