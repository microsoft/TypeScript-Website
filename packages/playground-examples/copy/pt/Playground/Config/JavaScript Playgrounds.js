/// { order: 3, isJavaScript: true }

// O playground agora pode manipular arquivos JavaScript

// É bem razoável imaginar porque nós adicionaríamos suporte
// para JavaScript no playground, mas é provável que a maioria
// dos usuários de TypeScript estejam usando JavaScript

// TypeScript pode usar inferência de tipos, aquisição de tipo e
// suporte JSDoc em um arquivo JavaScript para fornecer um
// vasto ambiente de ferramentas:
//
//  exemplo:objetos-e-vetores
//  exemplo:aquisição-de-tipo-automático
//  exemplo:suporte-jsdoc

// O playground suportar JavaScript significa que você pode 
// aprender e guiar pessoas através de exemplos complexos
// de JSDoc, ou depurar problemas quando existem expectativas
// incompatíveis.

// Por exemplo, por quê este comentário JSDoc não está tipado 
// corretamente?

/**
 * Soma 2 números
 * @param {number} O primeiro número
 * @param {number} O segundo número
 * @returns {number}
 */
function somaDoisNumeros(a, b) {
  return a + b;
}

// É muito mais fácil descobrir isso em um ambiente onde
// você pode ver imediatamente o que está acontecendo
// passando o cursor por cima
