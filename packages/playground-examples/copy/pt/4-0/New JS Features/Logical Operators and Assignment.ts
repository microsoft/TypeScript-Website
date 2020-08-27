//// { compiler: { ts: "4.0.2" } }

// Logical Operators e Assignment são novas funcionalidades do
// JavaScript para 2020. Esses são um conjunto de operadores novos
// que editam um objeto JavaScript.

// Seu objetivo é reutilizar o conceito de operadores 
// matemáticos (Ex: += -= *=) porém usando lógica.

interface User {
  id?: number
  name: string
  location: {
    postalCode?: string
  }
}

function updateUser(user: User) {
  // Pode-se trocar esse código:
  if (!user.id) user.id = 1

  // Ou esse código:
  user.id = user.id || 1

  // Por esse código:
  user.id ||= 1
}

// Esses conjuntos de operadores podem lidar com encadeamento profundo
// podendo poupar uma boa quantidade de código repetido.

declare const user: User
user.location.postalCode ||= "90210"

// São três novos operadores: 
//
//   ||= mostrado acima
//   &&= que usa a lógica do 'and' ao invés da 'or'
//   ??= que se baseia no example:nullish-coalescing para oferecer
//       uma versão mais rigorosa do || que usa === no lugar.

// Para mais informações da proposta, veja:
// https://github.com/tc39/proposal-logical-assignment
