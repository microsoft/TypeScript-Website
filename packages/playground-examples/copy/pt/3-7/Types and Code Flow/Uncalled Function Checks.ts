//// { compiler: {  }, order: 1 }

// Nova na versão 3.7, é uma verificação dentro de blocos 'if'
// para quando você acidentalmente usa uma função ao invés do valor
// de retorno da função.

// Isto só é aplicado quando a função é conhecida para existir
// fazendo com que o bloco 'if' sempre seja verdadeiro.

// Aqui está um exemplo de uma 'interface' onde existem
// 'callbacks' opcionais e não-opcionais.

interface PluginSettings {
  pluginShouldLoad?: () => void;
  pluginIsActivated: () => void;
}

declare const plugin: PluginSettings;

// Por 'pluginShouldLoad' poder não existir, então
// é uma verificação legítima.

if (plugin.pluginShouldLoad) {
  // Faça alguma coisa quando 'pluginShouldLoad' existir.
}

// Na versão 3.6 e anteriores, isto não era um erro.

if (plugin.pluginIsActivated) {
  // Quer fazer alguma coisa quando o plugin está ativado,
  // mas ao invés de chamar o método, nós usamos isso como uma
  // propriedade.
}

// 'pluginIsActivated' sempre deve existir, mas o TypeScript
// ainda permite a verificação, porque o método é chamado
// dentro do bloco 'if'.

if (plugin.pluginIsActivated) {
  plugin.pluginIsActivated();
}
