//// { order: 0, isJavaScript: true }

// O DOM (Document Object Model) é a API essencial para
// trabalhar com uma página web, e o TypeSctipt tem
// um bom suporte para essa API.

// Vamos criar um popover para ser exibido quando você pressionar "Executar"
// na barra de ferramentas no topo.

const popover = document.createElement("div");
popover.id = "popover-exemplo";

// Perceba que o popover está tipado corretamente para ser um HTMLDivElement
// especificamente porque passamos em uma "div".

// Para tornar possível reexecutar esse código, vamos primeiro
// adicionar uma função para remover o popover se ele já estiver presente. 

const removePopover = () => {
  const popoverExistente = document.getElementById(popover.id);
  if (popoverExistente && popoverExistente.parentElement) {
    popoverExistente.parentElement.removeChild(popoverExistente);
  }
};

// Então chame em seguida.

removePopover();

// Podemos definir os estilos em linha no elemento através da
// propriedade .style em um HTMLElement - isso é completamente tipado.

popover.style.backgroundColor = "#0078D4";
popover.style.color = "white";
popover.style.border = "1px solid black";
popover.style.position = "fixed";
popover.style.bottom = "10px";
popover.style.right = "20px";
popover.style.width = "200px";
popover.style.height = "100px";
popover.style.padding = "10px";

// Incluindo atributos CSS mais obscuros,ou depreciados.
popover.style.webkitBorderRadius = "4px";

// Para adicionar conteúdo ao popover, precisamos incluir
// um elemento parágrafo e usá-lo para adicionar algum texto. 

const mensagem = document.createElement("p");
mensagem.textContent = "Exemplo de popover";

// E também adicionaremos um botão de fechar.

const botaoFechar = document.createElement("a");
botaoFechar.textContent = "X";
botaoFechar.style.position = "absolute";
botaoFechar.style.top = "3px";
botaoFechar.style.right = "8px";
botaoFechar.style.color = "white";

botaoFechar.onclick = () => {
  removePopover();
};

// Então adicione todos esses elementos na página.
popover.appendChild(mensagem);
popover.appendChild(botaoFechar);
document.body.appendChild(popover);

// Se você apertar "Run" acima, então o popup deve aparecer
// no canto inferior esquerdo, podendo ser fechado clicando
// no x no canto superior direito. 

// Esse exemplo demonstra como você pode trabalhar com a API do DOM
// no JavaScript - mas usando TypeScript para prover ótimo 
// suporte ferramental.

// Existe um exemplo estendido para o ferramental TypeScript com  
// WebGL disponível aqui: example:typescript-with-webgl
