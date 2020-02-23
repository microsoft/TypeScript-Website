//// { order: 5, isJavaScript: true }

// 该例子通过使用 JavaScript 创建一个基于 WebGL 的 HTML canvas 来渲染一些旋转的彩色纸屑。
// 我们通过这些代码来了解它是如何工作的，看看 TypeScript 的工具所提供的便利。

// 该例子用于：example:working-with-the-dom

// 首先，我们需要创建一个 HTML canvas, 并通过 DOM API 来为该 canvas
// 设置一些样式：

const canvas = document.createElement('canvas')
canvas.id = 'spinning-canvas'
canvas.style.backgroundColor = '#0078D4'
canvas.style.position = 'fixed'
canvas.style.bottom = '10px'
canvas.style.right = '20px'
canvas.style.width = '500px'
canvas.style.height = '400px'

// 下一步，为了更方便地看到修改后的运行效果，我们先在点击 “运行” 按钮之后
// 把已存在的 canvas 移除掉——现在，你可以修改代码并点击 “运行” 来看看效
// 果了（或者按 Command + Enter）：

const existingCanvas = document.getElementById(canvas.id)
if (existingCanvas && existingCanvas.parentElement) {
  existingCanvas.parentElement.removeChild(existingCanvas)
}

// 告知 canvas 我们会使用 WebGL 方式来绘图（而不是默认的光栅渲染引擎）

const gl = canvas.getContext('webgl')

// 接着我们需要创建顶点着色器 - 简单来说，这些小的代码段会对输入的顶点
// 数组（浮点数）进行一系列数学变换。

// 你可以在着色器代码的最前面看到大量的属性，这些属性会在编译后被传递到
// 下面示例的着色器中。

// 该文章很好地介绍了 WebGL 是如何工作的：
// https://webglfundamentals.org/webgl/lessons/webgl-how-it-works.html

const vertexShader = gl.createShader(gl.VERTEX_SHADER)
gl.shaderSource(
  vertexShader,
  `
precision lowp float;

attribute vec2 a_position; // XY 平面上的正方形
attribute float a_startAngle;
attribute float a_angularVelocity;
attribute float a_rotationAxisAngle;
attribute float a_particleDistance;
attribute float a_particleAngle;
attribute float a_particleY;
uniform float u_time; // 全局状态

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

// 下面的例子用了片段着色器——片段着色器是另外一种小的代码片段，它用于
// 计算 canvas 画布中每个像素的颜色。

// 在这个例子里面，你可以通过尝试手动修改一下里面的一些数字的值，这样你就大概知道它们
// 都代表着什么样的变化了，它们会影响到场景中的光线、以及彩色纸屑的边框半径：

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

// 将编译后的着色器加入到 canvas 中的 WebGL 上下文中以供使用：

const shaderProgram = gl.createProgram()
gl.attachShader(shaderProgram, vertexShader)
gl.attachShader(shaderProgram, fragmentShader)
gl.linkProgram(shaderProgram)
gl.useProgram(shaderProgram)

gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer())

// 我们需要通过一种内存安全的方式来设置或者读取着色器变量，因此我们需要
// 先定义这些变量的长度以及偏移量：

// 译者注：
//    这些属性的数据类型都是浮点数，因此实际上 1 个单位空间长度相当于 4 个字节
//    这一点在后面的代码中有体现
//
//    例如：a_position 属性表示坐标位置，则包含 x 和 y. 在在内存中需要占 2 个单位长度的空间
//          a_startAngle 表示角度，只需要一个浮点数，占 1 个单位长度的空间

const attrs = [
  { name: "a_position", length: 2, offset: 0 }, 
  { name: "a_startAngle", length: 1, offset: 2 }, // but angle is just 1 value
  { name: "a_angularVelocity", length: 1, offset: 3 },
  { name: "a_rotationAxisAngle", length: 1, offset: 4 },
  { name: "a_particleDistance", length: 1, offset: 5 },
  { name: "a_particleAngle", length: 1, offset: 6 },
  { name: "a_particleY", length: 1, offset: 7 }
]

const STRIDE = Object.keys(attrs).length + 1

// 通过遍历我们上面定义的已知的属性，并在 JS 代码中为他们在内存中创建指针，通过这些指针我们可以把
// 值填充到着色器中。

// 为了更好理解这些 API，略作注解：WebGL 是一套基于 OpenGL 的状态机方式的 API。
// 你以特定的顺序输入命令，将内容呈现在屏幕上。

// 因此，我们常见的做法并不是把渲染的数据和对象传递给每一次 WebGL 的 API 调用，而是
// 把内容传递给一个函数，并由这个函数再传递给它的下一个函数调用，以此类推。所以，我们
// 在这里为 WebGL 创建一个顶点指针的数组：

for (var i = 0; i < attrs.length; i++) {
  const name = attrs[i].name
  const length = attrs[i].length
  const offset = attrs[i].offset
  const attribLocation = gl.getAttribLocation(shaderProgram, name)
  gl.vertexAttribPointer(attribLocation, length, gl.FLOAT, false, STRIDE * 4, offset * 4)
  gl.enableVertexAttribArray(attribLocation)
}

// 我们在把这些属性绑定到一个内存中的一个数组里：

gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, gl.createBuffer())

// 并定义一些渲染常量：

const NUM_PARTICLES = 200
const NUM_VERTICES = 4

// 你可以试着减少这个值，并反复点击 运行” 按钮
// 该值表示每个彩纸上应该有多少个点，如果你把它赋值为一个奇数，它看起来
// 就会不太正常。

const NUM_INDICES = 6

// 创建顶点着色器的输入数组
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
    vertices[vertexPtr + 2] = startAngle       // 初始角度
    vertices[vertexPtr + 3] = angularVelocity  // 角速度
    vertices[vertexPtr + 4] = axisAngle        // 角度差
    vertices[vertexPtr + 5] = particleDistance // 粒子到 (0,0,0) 的距离
    vertices[vertexPtr + 6] = particleAngle    // 粒子绕 Y 轴的旋转角度
    vertices[vertexPtr + 7] = particleY        // 粒子的 Y 轴坐标
  }

  // 坐标
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

// 把数据传递给 WebGL 上下文
gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW)
gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW)


const timeUniformLocation = gl.getUniformLocation(shaderProgram, "u_time")
const startTime = (window.performance || Date).now()

// 用黑色作为画布的擦除填充颜色
gl.clearColor(0, 0, 0, 1)

// 顶点着色器允许透明通道
gl.enable(gl.BLEND)
gl.blendFunc(gl.SRC_ALPHA, gl.ONE)

// 把 WebGL 上下文的尺寸设为和 canvas 的尺寸一致
gl.viewport(0, 0, canvas.width, canvas.height)

// 创建一个帧循环用于绘制彩纸
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

// 把 canvas 加入到当前页面的右下角
//
// 译者注：原注释中是 "bottom left"，其实是 "bottom right"
// 如位置需要调整，可以修改该范例代码最前面的 CSS 样式
document.body.appendChild(canvas)

// 鸣谢: 基于 Subzey 的这个 JSFiddle 范例:
// https://jsfiddle.net/subzey/52sowezj/
