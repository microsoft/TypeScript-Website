//// { compiler: {  }, order: 2 }

// O operador de coalescencia nula é uma alternativa ao ||
// que retorna o lado direito da expressão se o lado esquerdo
// é nulo ou undefined (indefinido)

// Em contraste, || usa a checagem falsy, significando que um texto vazio
// ou o número 0 seriam considerados falso.

// Um bom exemplo para essa funcionalidade é lidar com
// objetos que tem padrões quando uma chave não é passada.

interface ConfiguracaoDoApp {
  // Padrão: "(sem nome)"; texto vazio é válido
  nome: string;

  // Padrão: -1; 0 é válido
  itens: number;

  // Padrão: verdadeiro
  ativo: boolean;
}

function updateApp(configuracao: Partial<ConfiguracaoDoApp>) {
  // Com o operador null-coalescing
  configuracao.nome = configuracao.nome ?? "(sem nome)";
  configuracao.itens = configuracao.itens ?? -1;
  configuracao.ativo = configuracao.ativo ?? true;

  // Solução atual
  configuracao.nome = typeof configuracao.nome === "string" ? configuracao.nome : "(sem nome)";
  configuracao.itens = typeof configuracao.itens === "number" ? configuracao.itens : -1;
  configuracao.ativo = typeof configuracao.ativo === "boolean" ? configuracao.ativo : true;

  // Usando o operador || que poderia oferecer dados ruins
  configuracao.nome = configuracao.nome || "(sem nome)"; // não permite a entrada de ""
  configuracao.itens = configuracao.itens || -1; // não permite a entrada de 0
  configuracao.ativo = configuracao.ativo || true; // realmente ruim, sempre true (verdadeiro)
}
// Você pode ler mais sobre o operador nullish coalescing no post do blog do 3.7
//
// https://devblogs.microsoft.com/typescript/announcing-typescript-3-7/
