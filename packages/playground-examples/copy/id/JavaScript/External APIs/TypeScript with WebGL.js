//// { order: 5, isJavaScript: true }

// Di bawah ini merupakan contoh pembuata sebuah kanvas HTML
// yang menggunakan WebGL untuk menghasilkan _confetti_ yang
// berputar menggunakan JavaScript. Kita akan menelusuri kode
// program untuk mengerti bagaimana program bekerja, dan melihat
// bagaimana perkakas TypeScript menyediakan fitur yang berguna.

// Contoh ini dibangun berdasarkan: example:working-with-the-dom

// Pertama, kita harus membuat sebuah elemen `canvas`, yang
// kita buat menggunakan API DOM dan menetapkan beberapa
// _inline styles_:

const canvas = document.createElement("canvas")
canvas.id = "spinning-canvas"
canvas.style.backgroundColor = "#0078D4"
canvas.style.position = "fixed"
canvas.style.bottom = "10px"
canvas.style.right = "20px"
canvas.style.width = "500px"
canvas.style.height = "400px"

// Selanjutnya, untuk mempermudah perubahan, kita akan menghapus
// kanvas versi lama dengan ketika menekan tombol "Run"  - sekarang
// Anda dapat membuat perubahan dan melihat perubahan tersebut
// ketika Anda menekan tombol "Run" atau (`cmd + enter`):

const kanvasYangSudahAda = document.getElementById(canvas.id)
if (kanvasYangSudahAda && kanvasYangSudahAda.parentElement) {
  kanvasYangSudahAda.parentElement.removeChild(kanvasYangSudahAda)
}

// Perintahkan elemen kanvas untuk menggunakan WebGL ketika akan
// menggambar dalam elemen (dan jangan gunakan mesin _raster_ anggapan):

const gl = canvas.getContext("webgl")

// Selanjutnya, kita perlu untuk membuat _vertex shaders_ - sederhananya,
// _vertex shaders_ adalah program kecil yang menerapkan fungsi matematika
// pada sekumpulan titik (bilangan).

// Anda dapat melihat banyak atribut di atas _shader_, atribut-atribut
// tersebut akan diteruskan pada _shader_ hasil kompilasi pada 
// bagian bawah contoh.

// Anda dapat melihat gambaran umum tentang bagaimana WebGL bekerja
// melalui:
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

// Contoh ini juga menggunakan _fragment shader_ - sebuah 
// _fragment shader_ adalah program kecil yang berjalan
// di seluruh piksel dalam kanvas dan menetapkan warna bagi
// piksel.

// Dalam kasus ini, apabila Anda mencoba masukan lain, Anda dapat
// melihat bahwa masukan tersebut mempengaruhi pencahayaan pada
// layar, dan juga _border radius_ dari _confetti_:

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

// Ambil _shader-shader_ yang telah dikompilasi dan
// tambahkan _shader-shader_ tersebut ke dalam konteks
// kanvas WebGL sehingga dapat digunakan:

const shaderProgram = gl.createProgram()
gl.attachShader(shaderProgram, vertexShader)
gl.attachShader(shaderProgram, fragmentShader)
gl.linkProgram(shaderProgram)
gl.useProgram(shaderProgram)

gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer())

// Kita butuh kemampuan untuk menetapkan atau memperoleh
// variabel masukan pada _shader_ dengan cara yang aman
// secara memori, sehingga urutan dan panjang dari nilai-nilai
// harus disimpan.
const attrs = [
  { name: "a_position", length: 2, offset: 0 }, // contoh: x dan y membutuhkan dua tempat di memori
  { name: "a_startAngle", length: 1, offset: 2 }, // namun, _angle_ hanya membutuhkan satu tempat di memori
  { name: "a_angularVelocity", length: 1, offset: 3 },
  { name: "a_rotationAxisAngle", length: 1, offset: 4 },
  { name: "a_particleDistance", length: 1, offset: 5 },
  { name: "a_particleAngle", length: 1, offset: 6 },
  { name: "a_particleY", length: 1, offset: 7 }
]

const STRIDE = Object.keys(attrs).length + 1

// Lakukan _looping_ pada seluruh atribut yang diketahui dan buat _pointer_
// di memori supaya JavaScript dapat mengisi atribut-atribut
// tersebut pada _shader_.

// Berikut merupakan sedikit penjelasan mengenai API ini:
// WebGL merupakan teknologi yang berbasis pada OpenGL yang
// merupakan sebuah API dengan gaya _state-machine_. Anda
// dapat meneruskan perintah dalam urutan tertentu untuk
// mengeluarkan sesuatu pada layar.

// Sehingga, WebGL biasanya tidak bekerja dengan cara meneruskan
// seluruh objek pada setiap pemanggilan API WebGL, namun meneruskan
// satu objek pada sebuah fungsi, kemudian meneruskan objek lain
// pada fungsi selanjutnya. Sehingga, di sini kita memerintahkan WebGL
// untuk membuat sebuah _array vertex pointer_:

for (var i = 0; i < attrs.length; i++) {
  const name = attrs[i].name
  const length = attrs[i].length
  const offset = attrs[i].offset
  const attribLocation = gl.getAttribLocation(shaderProgram, name)
  gl.vertexAttribPointer(attribLocation, length, gl.FLOAT, false, STRIDE * 4, offset * 4)
  gl.enableVertexAttribArray(attribLocation)
}

// Kemudian pada baris ini, kumpulan _vertex pointer_ tersebut
// terikat pada sebuah _array_ dalam memori: 

gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, gl.createBuffer())

// Tetapkan beberapa konstanta yang akan digunakan pada proses _rendering_:

const NUM_PARTICLES = 200
const NUM_VERTICES = 4

// Coba kurangi nilai ini dan jalankan program kembali,
// nilai ini menentukan banyaknya titik yang ada
// pada setiap _confetti_ dan nilai ganjil akan
// mengacaukan _confetti_ yang ditampilkan.

const NUM_INDICES = 6

// Buat _array_ masukan untuk kumpulan _vertex shader_
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
    vertices[vertexPtr + 2] = startAngle       // Sudut awal
    vertices[vertexPtr + 3] = angularVelocity  // Kecepatan sudut
    vertices[vertexPtr + 4] = axisAngle        // Perbedaan arah
    vertices[vertexPtr + 5] = particleDistance // Jarak partikel yang dihitung dari titik (0, 0, 0)
    vertices[vertexPtr + 6] = particleAngle    // Arah berdasarkan sumbu Y
    vertices[vertexPtr + 7] = particleY        // Arah berdasarkan sumbu Y
  }

  // Koordinat
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

// Teruskan data pada konteks WebGL
gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW)
gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW)


const timeUniformLocation = gl.getUniformLocation(shaderProgram, "u_time")
const startTime = (window.performance || Date).now()

// Awali warna latar dengan warna hitam
gl.clearColor(0, 0, 0, 1)

// Nyalakan _alpha channel_ pada _vertex shader_
gl.enable(gl.BLEND)
gl.blendFunc(gl.SRC_ALPHA, gl.ONE)

// Tetapkan ukuran konteks WebGL sebesar ukuran kanvas
gl.viewport(0, 0, canvas.width, canvas.height)

  // Buat sebuah _run-loop_ untuk menggambar seluruh _confetti_ 
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

// Tambahkan elemen kanvas yang baru pada bagian
// kiri bawah dari arena bermain
document.body.appendChild(canvas)

// Dibuat berdasarkan JSFiddle biatan Subzey
// https://jsfiddle.net/subzey/52sowezj/
