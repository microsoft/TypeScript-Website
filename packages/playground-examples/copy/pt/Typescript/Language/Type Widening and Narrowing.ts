// Pode ser mais fácil começar a discussão do
// alargamento e estreitamento com um exemplo:

const welcomeString = "Olá! Estranho";
let replyString = "Hey";

// Além das diferenças de texto das strings, welcomeString
// é um const (o que significa que o valor nunca mudará)
// e replyString é um let (que significa que o valor pode mudar).

// Se você passar o mouse sobre as duas variáveis, 
// obterá informações de tipo muito diferentes do TypeScript:
//
//   const welcomeString: "Hello There"
//
//   let replyString: string

// TypeScript inferiu que o tipo do welcomeString é
// a string literal "Hello There", enquanto replyString
// é uma string genérica.

// Isso ocorre porque um let precisa ter um tipo mais amplo, você
// pode determinar replyString para ser qualquer outra string - no qual significa
// ter uma grande conjunto de possibilidades.

replyString = "Hi :wave:";

// Se replyString tiver uma string literal "Hey" - então
// você nunca poderia mudar o valor pois ele poderia mudar
// para apenas "Hey" de novo.

// Os alargamento e estreitamento de tipos são sobre expandir e reduzir
// as possibilidades no qual um tipo pode representar.

// Um exemplo de estreitamento de tipos é trabalhando com uniões, o
// exemplo do fluxo de análise do código é quase inteiramente baseado no
// estreitamento: example:code-flow

// O estreitamento de tipos é o que dá poder ao modo estrito do TypeScript
// por meio das verificações de nulidade. Com o modo estrito desligado,
// marcadores de nulidade como undefined e null são ignorados
// em uma união.

declare const quantumString: string | undefined;
// Isso irá falhar no modo strict apenas
quantumString.length;

// No modo estrito a responsabilidade recai sobre o autor do código para garantir
// que o tipo foi limitado ao tipo não nulo.
// Normalmente, isso é tão simples quanto uma verificação if:

if (quantumString) {
  quantumString.length;
}

// No modo estrito o tipo quantumString tem duas representações.
// Dentro do if, o tipo foi limitado para apenas string.

// Você pode ver mais exemplos de estreitamento aqui:
//
// example:union-and-intersection-types
// example:discriminate-types

// E ainda mais materiais na web:
//
// https://mariusschulz.com/blog/literal-type-widening-in-typescript
// https://sandersn.github.io/manual/Widening-and-Narrowing-in-Typescript.html
