// Aquisição Automática de Tipo é o termo para como o TypeScript
// obtém definições de tipo do @types no npm nos bastidores para
// conceder uma umelhor experiência de usuário para os usuários
// de JavaScript.

// O playground agora tem uma versão similar (porém um pouco
// mais limitada ) do processo de aquisição de tipo intergrado
// ao TypeScript.

// Você pode utilizá-lo criando importações no seu código.
// Funciona tanto através do @types do DefinitelyTyped ou por
// arquivos d.ts dentro da própria dependência.

import { danger } from "danger";

// Destaque estes identificadores abaixo para ver os JSDocs
// associados dos tipos integrados:

danger.github;

// Isto também manipula dependências transitivas, então nesse caso,
// danger também depende do @octokit/rest.

danger.github.api.pulls.createComment();

// Aquisição de Tipo também irá levar os módulos integrados do
// Node em consideração e puxar as declarações de tipo do Node
// quando você usa qualquer uma dessas dependências. Observe que,
// esses tendem a ser mais longos que os outros já que existem
// muitos tipos para serem baixados.

import { readFileSync } from "fs";

const inputPath = "my/path/file.ts";
readFileSync(inputPath, "utf8");
