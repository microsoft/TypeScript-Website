// Com o novo Playground, nós temos muito mais controle sobre
// o ambiente em que seu código é executado. O novo Playground
// está agora levemente acoplado ao monaco-editor e ao 
// monaco-typescript que fornecem a experiência de edição

// https://github.com/microsoft/monaco-editor/
// https://github.com/microsoft/monaco-typescript

// Levemente acoplado significa que o playground permite que o
// usuário tenha suporte ao uso de diferentes versões
// do TypeScript que o monaco-typescript tem integrado.

// Nós temos a infraestrutura para criar uma cópia do monaco-editor
// e do monaco-typescript para qualquer versão do TypeScript. Isso
// significa que agora nós podemos suportar:

// - Versões beta do TypeScript
// - Versões Nigthly do TypeScript
// - Versões em Pull Request do TypeScript
// - Versões antigas do TypeScript

// via https://github.com/orta/make-monaco-builds

// A arquitetura essencial para explicar como o playground agora
// suporta diferentes versões do TypeScript vem de uma fork 
// do projeto do qual esse site deriva:

// https://github.com/agentcooper/typescript-play
