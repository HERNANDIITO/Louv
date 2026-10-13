import { mat4, vec3 } from "gl-matrix";
import { IEntity } from "./IEntity.class";
import { RenderContext } from "../utilities/RenderContext.class";
import { FacadeWebgl } from "../../interface-webgl.class";
import {
  ResourceManager,
  resourceType,
} from "../utilities/ResourceManager.class";
import { ShaderResource } from "../resources/RShader.class";

export class AABBEntity extends IEntity {
  public min = vec3.create();
  public max = vec3.create();
  public color = vec3.fromValues(0, 1, 0);

  private static _vao: WebGLVertexArrayObject | null = null;
  private static _shader: ShaderResource | null = null;
  private static _initialized = false;

  constructor(min: vec3, max: vec3) {
    super();
    vec3.copy(this.min, min);
    vec3.copy(this.max, max);
    this._initGPUResources();
  }

  private async _initGPUResources() {
    if (AABBEntity._initialized) return;
    AABBEntity._initialized = true;

    const gl = FacadeWebgl._gl;
    const rm = ResourceManager.getInstance();

    AABBEntity._shader = rm.getResource(
      "debug",
      resourceType.shader,
    ) as ShaderResource;
    await AABBEntity._shader.loadResource("debug");

    const vertices = new Float32Array([
      0,
      0,
      0,
      1,
      0,
      0,
      1,
      1,
      0,
      0,
      1,
      0, // atrás
      0,
      0,
      1,
      1,
      0,
      1,
      1,
      1,
      1,
      0,
      1,
      1, // alante
    ]);
    const indices = new Uint16Array([
      0,
      1,
      1,
      2,
      2,
      3,
      3,
      0, // cara atrás
      4,
      5,
      5,
      6,
      6,
      7,
      7,
      4, // cara alante
      0,
      4,
      1,
      5,
      2,
      6,
      3,
      7, // líneas de unión
    ]);

    AABBEntity._vao = gl.createVertexArray();
    gl.bindVertexArray(AABBEntity._vao);

    const vbo = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
    gl.enableVertexAttribArray(0);
    gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 0, 0);

    const ebo = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ebo);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);

    gl.bindVertexArray(null);
  }

  public override render(modelMatrix: mat4, context: RenderContext): void {
    const gl = FacadeWebgl._gl;
    if (!AABBEntity._vao || !AABBEntity._shader || context.isShadowPass) return;

    const size = vec3.create();
    vec3.sub(size, this.max, this.min);

    const localBoxMat = mat4.create();
    mat4.translate(localBoxMat, localBoxMat, this.min);
    mat4.scale(localBoxMat, localBoxMat, size);

    const finalMat = mat4.create();
    mat4.multiply(finalMat, modelMatrix, localBoxMat);

    AABBEntity._shader.use();
    AABBEntity._shader.setUniform("u_model", finalMat);
    AABBEntity._shader.setUniform("u_view", context.viewMatrix);
    AABBEntity._shader.setUniform("u_projection", context.projectionMatrix);
    AABBEntity._shader.setUniform("u_color", this.color);

    gl.bindVertexArray(AABBEntity._vao);
    gl.drawElements(gl.LINES, 24, gl.UNSIGNED_SHORT, 0);
    gl.bindVertexArray(null);
  }

  public override update(deltaTime: number, node: any): void {
    
  }

  public override destroy(): void {

  }
}