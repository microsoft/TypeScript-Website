//// { order: 5, isJavaScript: true }

// Esse exemplo cria um HTML canvas que faz uso do WebGL para
// renderizar confetes giratórios usando JavaScript. Iremos 
// caminhar pelo código para entender como ele funciona, e 
// ver como o ferramental do TypeScript fornece dicas úteis.

// Esse exemplo compõe: example:working-with-the-dom

// Primeiro, precisamos criar um elemento HTML canvas, feito
// pela API do DOM e definir alguns atributos de estilo em linha. 

const canvas = document.createElement("canvas")
canvas.id = "canvas-giratorio"
canvas.style.backgroundColor = "#0078D4"
canvas.style.position = "fixed"
canvas.style.bottom = "10px"
canvas.style.right = "20px"
canvas.style.width = "500px"
canvas.style.height = "400px"

// Em seguida, para tornar mais fácil fazer alterações, nós removemos 
// quaisquer versões antigas do canvas quando clicamos "Run" - e agora você pode
// fazer alterações e vê-las refletidas quando apertar "Run"
// ou (cmd + enter):

const canvasExistente = document.getElementById(canvas.id)
if (canvasExistente && canvasExistente.parentElement) {
  canvasExistente.parentElement.removeChild(canvasExistente)
}

// Diga ao elemento canvas que iremos usar o WebGL para desenhar
// dentro do elemento (e não a ferramenta padrão de raster):

const gl = canvas.getContext("webgl")

// Em seguida precisamos criar sombreadores de vértices - eles são,
// a grosso modo, programas que aplicam matemática a um grupo de 
// de arrays ou vértices de entrada (números).

// Você pode ver o grande grupo de atributos no topo do sombreador,
// esses são passados para ao sombreador compilado no exemplo mais abaixo. 

// Existe uma visão geral boa de como eles funcionam aqui:
// https://webglfundamentals.org/webgl/lessons/webgl-how-it-works.html

const sombreadorVertice = gl.createShader(gl.VERTEX_SHADER)
gl.shaderSource(
  sombreadorVertice,
  `
precision lowp float;

attribute vec2 a_position; // Flat square on XY plane
attribute float a_startAngle;
attribute float a_angularVelocity;
attribute float a_rotationAxisAngle;
attribute float a_particleDistance;
attribute float a_particleAngle;
attribute float a_particleY;
uniform float u_time; // Global state

varying vec2 v_position;
varying vec3 v_color;
varying float v_overlight;

void main() {
  float angle = a_startAngle + a_angularVelocity * u_time;
  float vertPosition = 1.1 - mod(u_time * .25 + a_particleY, 2.2);
  float viewAngle = a_particleAngle + mod(u_time * .25, 6.28);

  mat4 vMatrix = mat4(
    1.3, 0.0, 0.0, 0.0,
    0.0, 1.3, 0.0, 0.0,
    0.0, 0.0, 1.0, 1.0,
    0.0, 0.0, 0.0, 1.0
  );

  mat4 shiftMatrix = mat4(
    1.0, 0.0, 0.0, 0.0,
    0.0, 1.0, 0.0, 0.0,
    0.0, 0.0, 1.0, 0.0,
    a_particleDistance * sin(viewAngle), vertPosition, a_particleDistance * cos(viewAngle), 1.0
  );

  mat4 pMatrix = mat4(
    cos(a_rotationAxisAngle), sin(a_rotationAxisAngle), 0.0, 0.0,
    -sin(a_rotationAxisAngle), cos(a_rotationAxisAngle), 0.0, 0.0,
    0.0, 0.0, 1.0, 0.0,
    0.0, 0.0, 0.0, 1.0
  ) * mat4(
    1.0, 0.0, 0.0, 0.0,
    0.0, cos(angle), sin(angle), 0.0,
    0.0, -sin(angle), cos(angle), 0.0,
    0.0, 0.0, 0.0, 1.0
  );

  gl_Position = vMatrix * shiftMatrix * pMatrix * vec4(a_position * 0.03, 0.0, 1.0);
  vec4 normal = vec4(0.0, 0.0, 1.0, 0.0);
  vec4 transformedNormal = normalize(pMatrix * normal);

  float dotNormal = abs(dot(normal.xyz, transformedNormal.xyz));
  float regularLighting = dotNormal / 2.0 + 0.5;
  float glanceLighting = smoothstep(0.92, 0.98, dotNormal);
  v_color = vec3(
    mix((0.5 - transformedNormal.z / 2.0) * regularLighting, 1.0, glanceLighting),
    mix(0.5 * regularLighting, 1.0, glanceLighting),
    mix((0.5 + transformedNormal.z / 2.0) * regularLighting, 1.0, glanceLighting)
  );

  v_position = a_position;
  v_overlight = 0.9 + glanceLighting * 0.1;
}
`
)
gl.compileShader(sombreadorVertice)

// Esse exemplo também faz uso sombreadores em fragmento - um sombreador
// em fragmento é outro pequeno programa que passa por todo
// pixel presente no canvas e define sua cor.

// Nesse caso, se brincar com os números você pode ver como
// isso afeta a iluminação na cena, tal como a espessura da 
// da borda no confete:

const sombreadorFragmentos = gl.createShader(gl.FRAGMENT_SHADER)
gl.shaderSource(
  sombreadorFragmentos,
  `
precision lowp float;
varying vec2 v_position;
varying vec3 v_color;
varying float v_overlight;

void main() {
  gl_FragColor = vec4(v_color, 1.0 - smoothstep(0.8, v_overlight, length(v_position)));
}
`
)
gl.compileShader(sombreadorFragmentos)

// Recebe o sombreador compilado e o adiciona ao contexto
// WebGL do canvas para que possa ser usado:

const sombreador = gl.createProgram()
gl.attachShader(sombreador, sombreadorVertice)
gl.attachShader(sombreador, sombreadorFragmentos)
gl.linkProgram(sombreador)
gl.useProgram(sombreador)

gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer())

// Precisamos obter/definir as variáveis de entrada para o sombreador de 
// uma maneira segura para memória, para que a ordem e o comprimento de seus 
// valores precisam ser armazenados.

const attrs = [
  { name: "a_position", length: 2, offset: 0 }, // ex: x e y representam 2 espaços na memória
  { name: "a_startAngle", length: 1, offset: 2 }, // mas o ângulo, apenas 1 valor
  { name: "a_angularVelocity", length: 1, offset: 3 },
  { name: "a_rotationAxisAngle", length: 1, offset: 4 },
  { name: "a_particleDistance", length: 1, offset: 5 },
  { name: "a_particleAngle", length: 1, offset: 6 },
  { name: "a_particleY", length: 1, offset: 7 }
]

const STRIDE = Object.keys(attrs).length + 1

// Itere sobre nossos atributos conhecidos e crie ponteiros na memória para que o lado JS
// possa ser capaz de preencher o sombreador. 

// Para compreender essa API um pouco: WebGL é baseada no OpenGL
// que é uma 'API baseada em uma máquina de estados'. Você passa comandos em uma 
// ordem em particular para renderizar coisas na tela.

// Então, o uso desejado é geralmente não passar objetos para cada chamada
// API WebGL, mas passar uma coisa para uma função, então passar outra
// para a próxima. Então, aqui otimizamos o WebGL para criar um array de 
// vértices ponteiro.

for (var i = 0; i < attrs.length; i++) {
  const name = attrs[i].name
  const length = attrs[i].length
  const offset = attrs[i].offset
  const attribLocation = gl.getAttribLocation(shaderProgram, name)
  gl.vertexAttribPointer(attribLocation, length, gl.FLOAT, false, STRIDE * 4, offset * 4)
  gl.enableVertexAttribArray(attribLocation)
}

// Então nessa linha eles são ligados a um array em memória:

gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, gl.createBuffer())

// Define algumas constantes para renderização:

const NUM_PARTICLES = 200
const NUM_VERTICES = 4

// Tente reduzi-las e clicar em "Run" de novo, 
// elas representam quantos pontos deveriam existir em
// cada confete e ter um número ímpar 
// tira tudo dos eixos.

const NUM_INDICES = 6

// Cria os arrays de entradas para os sombreadores de vértices.
const vertices = new Float32Array(NUM_PARTICLES * STRIDE * NUM_VERTICES)
const indices = new Uint16Array(NUM_PARTICLES * NUM_INDICES)

for (let i = 0; i < NUM_PARTICLES; i++) {
  const axisAngle = Math.random() * Math.PI * 2
  const startAngle = Math.random() * Math.PI * 2
  const groupPtr = i * STRIDE * NUM_VERTICES

  const particleDistance = Math.sqrt(Math.random())
  const particleAngle = Math.random() * Math.PI * 2
  const particleY = Math.random() * 2.2
  const angularVelocity = Math.random() * 2 + 1

  for (let j = 0; j < 4; j++) {
    const vertexPtr = groupPtr + j * STRIDE
    vertices[vertexPtr + 2] = startAngle       // Angulo inicial
    vertices[vertexPtr + 3] = angularVelocity  // Velocidade angular
    vertices[vertexPtr + 4] = axisAngle        // Diferença de ângulo
    vertices[vertexPtr + 5] = particleDistance // Distancia de partículas indo de (0,0,0)
    vertices[vertexPtr + 6] = particleAngle    // Angulo em volta do eixo Y
    vertices[vertexPtr + 7] = particleY        // Angulo em volta do eixo y
  }

  // Coordenadas
  vertices[groupPtr] = vertices[groupPtr + STRIDE * 2] = -1
  vertices[groupPtr + STRIDE] = vertices[groupPtr + STRIDE * 3] = +1
  vertices[groupPtr + 1] = vertices[groupPtr + STRIDE + 1] = -1
  vertices[groupPtr + STRIDE * 2 + 1] = vertices[groupPtr + STRIDE * 3 + 1] = +1

  const indicesPtr = i * NUM_INDICES
  const vertexPtr = i * NUM_VERTICES
  indices[indicesPtr] = vertexPtr
  indices[indicesPtr + 4] = indices[indicesPtr + 1] = vertexPtr + 1
  indices[indicesPtr + 3] = indices[indicesPtr + 2] = vertexPtr + 2
  indices[indicesPtr + 5] = vertexPtr + 3
}

// Passando o conteúdo para o contexto do WebGL
gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW)
gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW)


const timeUniformLocation = gl.getUniformLocation(shaderProgram, "u_time")
const startTime = (window.performance || Date).now()

// Inicia a cor do fundo como preto.
gl.clearColor(0, 0, 0, 1)

// Permite canais alfa no sombreador de vértices.
gl.enable(gl.BLEND)
gl.blendFunc(gl.SRC_ALPHA, gl.ONE)

// Define o contexto do WebGL para ter o tamanho total do canvas
gl.viewport(0, 0, canvas.width, canvas.height)

  // Cria um loop de execução para desenhar todos os confetes
  ; (function frame() {
    gl.uniform1f(timeUniformLocation, ((window.performance || Date).now() - startTime) / 1000)

    gl.clear(gl.COLOR_BUFFER_BIT)
    gl.drawElements(
      gl.TRIANGLES,
      NUM_INDICES * NUM_PARTICLES,
      gl.UNSIGNED_SHORT,
      0
    )
    requestAnimationFrame(frame)
  })()

// Adiciona o novo elemento canvas no canto inferior esquerdo
// do playground
document.body.appendChild(canvas)

// Creditos: baseado nesse JSFiddle por Subzey
// https://jsfiddle.net/subzey/52sowezj/
