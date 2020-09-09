//// { compiler: {  }, order: 1 }

// O TypeScript suporta muitos fixits que ajudam a refatorar
// seu código. Por exemplo, se você selecionar o texto
// na linha 7 e clicar na lâmpada que aparece, você
// receberá algumas sugestões de refatoração.

function addOne(x: number) {
  return x + 1;
}

// Este recurso está disponível a partir do TypeScript versão 3.7,
// que também incluirá compilações noturnas.

// Provavelmente isso é algo que você não vai usar
// no playground quando estiver aprendendo ou testando exemplos.

// De qualquer maneira, ter fixits disponíveis significa que
// podemos documentá-las no playground e isso é valioso.

// example:big-number-literals
// example:const-to-let
// example:infer-from-usage-changes
