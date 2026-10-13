import { mat4, vec3 } from "https://cdn.jsdelivr.net/npm/gl-matrix@3.4.3/+esm";
// AÑADIMOS LA LIBRERÍA DE LECTURA GLTF
import { WebIO } from "https://cdn.jsdelivr.net/npm/@gltf-transform/core@3.0.0/+esm";

/* =========================
   CONFIGURACIÓN GLOBAL
========================= */
const cameraPosition = vec3.fromValues(0, 0.5, 3.5);
const lightPosition = vec3.fromValues(5, 5, 5);

let gl, program, vao;
let modelLoc, viewLoc, projectionLoc, cameraPosLoc, lightPosLoc;
let model, view, projection;

let modelGeometry = { indicesCount: 0, vertexCount: 0, indicesType: null };
let modelCenter = vec3.fromValues(0, 0, 0);

/* =========================
   INICIALIZACIÓN PRINCIPAL
========================= */
async function main() {
  gl = createContext("c");
  program = await createProgram(gl, "./shaders/shader.vert", "./shaders/shader.frag");
  getUniformLocations(gl, program);
  createMatrices(gl);

  await createGeometryVAO(gl, program);

  configureRenderState(gl);
  setStaticUniforms(gl);
  start();
}

function createContext(canvasId) {
  const canvas = document.getElementById(canvasId);
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  const context = canvas.getContext("webgl2");
  if (!context) throw new Error("WebGL2 no soportado.");
  return context;
}

async function createProgram(gl, vertPath, fragPath) {
  const [vertSrc, fragSrc] = await Promise.all([
    fetch(vertPath).then((r) => r.text()),
    fetch(fragPath).then((r) => r.text()),
  ]);

  const vertexShader = compileShader(gl, gl.VERTEX_SHADER, vertSrc);
  const fragmentShader = compileShader(gl, gl.FRAGMENT_SHADER, fragSrc);

  const prog = gl.createProgram();
  gl.attachShader(prog, vertexShader);
  gl.attachShader(prog, fragmentShader);
  gl.linkProgram(prog);

  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
    throw new Error("Error enlazando programa:\n" + gl.getProgramInfoLog(prog));
  }
  return prog;
}

function compileShader(gl, type, source) {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    throw new Error(`Error compilando shader:\n` + gl.getShaderInfoLog(shader));
  }
  return shader;
}

function getUniformLocations(gl, program) {
  modelLoc = gl.getUniformLocation(program, "u_model");
  viewLoc = gl.getUniformLocation(program, "u_view");
  projectionLoc = gl.getUniformLocation(program, "u_projection");
  lightPosLoc = gl.getUniformLocation(program, "u_lightPos");
  cameraPosLoc = gl.getUniformLocation(program, "u_cameraPos");
}

function createMatrices(gl) {
  model = mat4.create();
  view = mat4.create();
  projection = mat4.create();

  mat4.lookAt(view, cameraPosition, [0, 0, 0], [0, 1, 0]);
  const aspect = gl.canvas.width / gl.canvas.height;
  mat4.perspective(projection, Math.PI / 4, aspect, 0.1, 100);
}

function setStaticUniforms(gl) {
  gl.useProgram(program);
  gl.uniform3fv(lightPosLoc, lightPosition);
  gl.uniform3fv(cameraPosLoc, cameraPosition);
  gl.uniformMatrix4fv(viewLoc, false, view);
  gl.uniformMatrix4fv(projectionLoc, false, projection);
}

/* =========================
   CARGA CON LIBRERÍA GLTF
========================= */
/* =========================
   CARGA CON LIBRERÍA GLTF
========================= */
async function createGeometryVAO(gl, program) {
  const io = new WebIO();
  const gltfDoc = await io.read("/models/Avocado.gltf");
  const root = gltfDoc.getRoot();
  const primitive = root.listMeshes()[0].listPrimitives()[0];

  const posAccessor = primitive.getAttribute("POSITION");
  const min = posAccessor.getMin([]);
  const max = posAccessor.getMax([]);
  vec3.set(modelCenter, (max[0] + min[0]) / 2, (max[1] + min[1]) / 2, (max[2] + min[2]) / 2);

  vao = gl.createVertexArray();
  gl.bindVertexArray(vao);

  const positionAttribute = primitive.getAttribute("POSITION");
  const positionsBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, positionsBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, positionAttribute.getArray(), gl.STATIC_DRAW);
  const positionsLoc = gl.getAttribLocation(program, "a_position");
  gl.enableVertexAttribArray(positionsLoc);
  gl.vertexAttribPointer(positionsLoc, positionAttribute.getElementSize(), gl.FLOAT, false, 0, 0);

  const normalAttribute = primitive.getAttribute("NORMAL");
  const normalsBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, normalsBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, normalAttribute.getArray(), gl.STATIC_DRAW);
  const normalsLoc = gl.getAttribLocation(program, "a_normal");
  gl.enableVertexAttribArray(normalsLoc);
  gl.vertexAttribPointer(normalsLoc, normalAttribute.getElementSize(), gl.FLOAT, false, 0, 0);

  const textureAttribute = primitive.getAttribute("TEXCOORD_0");
  const texturesBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, texturesBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, textureAttribute.getArray(), gl.STATIC_DRAW);
  const texturesLoc = gl.getAttribLocation(program, "a_uv");
  gl.enableVertexAttribArray(texturesLoc);
  gl.vertexAttribPointer(texturesLoc, textureAttribute.getElementSize(), gl.FLOAT, false, 0, 0);

  const indicesAccessor = primitive.getIndices();
  const indicesBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indicesBuffer);
  const indicesArray = indicesAccessor.getArray();
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indicesArray, gl.STATIC_DRAW);

  modelGeometry.indicesCount = indicesArray.length;
  modelGeometry.vertexCount = positionAttribute.getCount();

  switch (indicesAccessor.getComponentType()) {
    case 5121:
      modelGeometry.indicesType = gl.UNSIGNED_BYTE;
      break;
    case 5123:
      modelGeometry.indicesType = gl.UNSIGNED_SHORT;
      break;
    case 5125:
      modelGeometry.indicesType = gl.UNSIGNED_INT;
      break;
    default:
      throw new Error("Tipo de índice GLTF no soportado");
  }

  gl.bindVertexArray(null);
}

/* =========================
   ESTADO DE RENDER Y BUCLE
========================= */
function configureRenderState(gl) {
  gl.enable(gl.CULL_FACE);
  gl.cullFace(gl.BACK);
  gl.frontFace(gl.CCW);
  gl.enable(gl.DEPTH_TEST);
  gl.clearColor(0.1, 0.1, 0.1, 1.0);
}

function update() {
  mat4.identity(model);
  mat4.scale(model, model, [25.0, 25.0, 25.0]);
  mat4.translate(model, model, [-modelCenter[0], -modelCenter[1], -modelCenter[2]]);
  mat4.rotateY(model, model, performance.now() * 0.001);
  gl.useProgram(program);
  gl.uniformMatrix4fv(modelLoc, false, model);
}

function render() {
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  gl.useProgram(program);
  gl.bindVertexArray(vao);
  gl.drawElements(gl.TRIANGLES, modelGeometry.indicesCount, modelGeometry.indicesType, 0);
  gl.bindVertexArray(null);
}

function start() {
  function loop() {
    update();
    render();
    requestAnimationFrame(loop);
  }
  loop();
}

main().catch((err) => console.error("Error iniciando WebGL:", err));