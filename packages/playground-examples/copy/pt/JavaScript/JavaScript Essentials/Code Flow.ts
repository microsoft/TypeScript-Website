//// { title: "Fluxo de código", order: 3, compiler: { strictNullChecks: true } }

// Como o código flui dentro de nossos arquivos JavaScript pode afetar
// os tipos em nossos programas.

const users = [{ name: 'Ahmed' }, { name: 'Gemma' }, { name: 'João' }]

// Vamos ver se conseguimos encontrar um usuário chamado "João".
const joao = users.find(u => u.name === 'João')

// No caso acima, 'find' pode falhar. Nesse caso, nós
// não tem um objeto. Isso cria o tipo:
//
//   { name: string } | undefined
//
// Se você passar o mouse sobre os três usos a seguir de 'joao' abaixo,
// você verá como os tipos mudam dependendo de onde a palavra está localizada:

if (joao) {
  joao
} else {
  joao
}
