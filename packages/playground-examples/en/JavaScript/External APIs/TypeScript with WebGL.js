//// { order: 5, isJavaScript: true }

// This example creates an HTML canvas which uses WebGL to
// render spinning confetti using JavaScript. We're going
// to walk through the code to understand how it works, and
// see how TypeScript's tooling provides useful insight.

// This example builds off: example:working-with-the-dom

// First up, we need to create an HTML canvas element, which
// we do via the DOM API and set some inline style attributes:

const canvas = document.createElement("canvas")
canvas.id = "spinning-canvas"
canvas.style.backgroundColor = "#0078D4"
canvas.style.position = "fixed"
canvas.style.bottom = "10px"
canvas.style.right = "20px"
canvas.style.width = "500px"
canvas.style.height = "400px"

// Next, to make it easy to make changes, we remove any older
// versions of the canvas when hitting "Run" - now you can
// make changes and see them reflected when you press "Run"
// or (cmd + enter):

const existingCanvas = document.getElementById(canvas.id)
if (existingCanvas && existingCanvas.parentElement) {
  existingCanvas.parentElement.removeChild(existingCanvas)
}

// Tell the canvas element that we will use WebGL to draw
// inside the element (and not the default raster engine):

const gl = canvas.getContext("webgl")

// Next we need to create vertex shaders - these roughly are
// small programs that apply maths to a set of incoming
// array of vertices (numbers).

// You can see the large set of attributes at the top of the shader,
// these are passed into the compiled shader further down the example.

// There's a great overview on how they work here:
// https://webglfundamentals.org/webgl/lessons/webgl-how-it-works.html

const vertexShader = gl.createShader(gl.VERTEX_SHADER)
gl.shaderSource(
  vertexShader,
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
gl.compileShader(vertexShader)

// This example also uses fragment shaders - a fragment
// shader is another small program that runs through every
// pixel in the canvas and sets its color.

// In this case, if you play around with the numbers you can see how
// this affects the lighting in the scene, as well as the border
// radius on the confetti:

const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER)
gl.shaderSource(
  fragmentShader,
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
gl.compileShader(fragmentShader)

// Takes the compiled shaders and adds them to the canvas'
// WebGL context so that can be used:

const shaderProgram = gl.createProgram()
gl.attachShader(shaderProgram, vertexShader)
gl.attachShader(shaderProgram, fragmentShader)
gl.linkProgram(shaderProgram)
gl.useProgram(shaderProgram)

gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer())

// We need to get/set the input variables into the shader in a
// memory-safe way, so the order and the length of their
// values needs to be stored.

const attrs = [
  { name: "a_position", length: 2, offset: 0 }, // e.g. x and y represent 2 spaces in memory
  { name: "a_startAngle", length: 1, offset: 2 }, // but angle is just 1 value
  { name: "a_angularVelocity", length: 1, offset: 3 },
  { name: "a_rotationAxisAngle", length: 1, offset: 4 },
  { name: "a_particleDistance", length: 1, offset: 5 },
  { name: "a_particleAngle", length: 1, offset: 6 },
  { name: "a_particleY", length: 1, offset: 7 }
]

const STRIDE = Object.keys(attrs).length + 1

// Loop through our known attributes and create pointers in memory for the JS side
// to be able to fill into the shader.

// To understand this API a little bit: WebGL is based on OpenGL
// which is a state-machine styled API. You pass in commands in a
// particular order to render things to the screen.

// So, the intended usage is often not passing objects to every WebGL
// API call, but instead passing one thing to one function, then passing
// another to the next. So, here we prime WebGL to create an array of
// vertex pointers:

for (var i = 0; i < attrs.length; i++) {
  const name = attrs[i].name
  const length = attrs[i].length
  const offset = attrs[i].offset
  const attribLocation = gl.getAttribLocation(shaderProgram, name)
  gl.vertexAttribPointer(attribLocation, length, gl.FLOAT, false, STRIDE * 4, offset * 4)
  gl.enableVertexAttribArray(attribLocation)
}

// Then on this line they are bound to an array in memory:

gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, gl.createBuffer())

// Set up some constants for rendering:

const NUM_PARTICLES = 200
const NUM_VERTICES = 4

// Try reducing this one and hitting "Run" again,
// it represents how many points should exist on
// each confetti and having an odd number sends
// it way out of whack.

const NUM_INDICES = 6

// Create the arrays of inputs for the vertex shaders
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
    vertices[vertexPtr + 2] = startAngle       // Start angle
    vertices[vertexPtr + 3] = angularVelocity  // Angular velocity
    vertices[vertexPtr + 4] = axisAngle        // Angle diff
    vertices[vertexPtr + 5] = particleDistance // Distance of the particle from the (0,0,0)
    vertices[vertexPtr + 6] = particleAngle    // Angle around Y axis
    vertices[vertexPtr + 7] = particleY        // Angle around Y axis
  }

  // Coordinates
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

// Pass in the data to the WebGL context
gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW)
gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW)


const timeUniformLocation = gl.getUniformLocation(shaderProgram, "u_time")
const startTime = (window.performance || Date).now()

// Start the background colour as black
gl.clearColor(0, 0, 0, 1)

// Allow alpha channels on in the vertex shader
gl.enable(gl.BLEND)
gl.blendFunc(gl.SRC_ALPHA, gl.ONE)

// Set the WebGL context to be the full size of the canvas
gl.viewport(0, 0, canvas.width, canvas.height)

// Create a run-loop to draw all of the confetti
;(function frame() {
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

// Add the new canvas element into the bottom left
// of the playground
document.body.appendChild(canvas)

// Credit: based on this JSFiddle by Subzey
// https://jsfiddle.net/subzey/52sowezj/
