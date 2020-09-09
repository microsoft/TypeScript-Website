//// { compiler: {  }, order: 2 }

// O operador de Coalescência Nula é uma alternativa ao ||
// no qual retorna a expressão do lado direito se o lado esquerdo
// é nulo ou undefined.

// Em contraste, || usa uma checagem falsa, significando uma string 
// vazia ou o número 0 seria considerado falso.

// Um bom exemplo para essa característica é lidar com objetos
// parciais no qual tem dificuldade quando a chave não é passada

interface AppConfiguration {
  // Default: "(sem nome)"; String vazia é válido
  name: string;

  // Default: -1; 0 é válido
  items: number;

  // Default: true
  active: boolean;
}

function updateApp(config: Partial<AppConfiguration>) {
  // Com operador nulo-coalescente
  config.name = config.name ?? "(sem nome)";
  config.items = config.items ?? -1;
  config.active = config.active ?? true;

  // Solução Atual
  config.name = typeof config.name === "string" ? config.name : "(no name)";
  config.items = typeof config.items === "number" ? config.items : -1;
  config.active = typeof config.active === "boolean" ? config.active : true;

  // Usando o operador || no qual pode retornar dados ruins
  config.name = config.name || "(no name)"; // Não possibilita "" para input
  config.items = config.items || -1; // Não possibilita 0 para input
  config.active = config.active || true; // realmente ruim, sempre verdadeiro
}

// Você pode ler mais sobre Coalescência Nula no Post 3.7 do Blog: 

// https://devblogs.microsoft.com/typescript/announcing-typescript-3-7/
