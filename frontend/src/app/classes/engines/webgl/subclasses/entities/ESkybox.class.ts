import { mat4 } from "gl-matrix";
import { IEntity } from "./IEntity.class";
import { RenderContext } from "../utilities/RenderContext.class";
import { FacadeWebgl } from "../../interface-webgl.class";
import { ShaderResource } from "../resources/RShader.class";
import {
  ResourceManager,
  resourceType,
} from "../utilities/ResourceManager.class";

export class SkyboxEntity extends IEntity {
  private _vao: WebGLVertexArrayObject | null = null;
  private _shader: ShaderResource | null = null;

  constructor() {
    super();
    this._initBuffer();
  }

  private _initBuffer() {
    const gl = FacadeWebgl._gl;

    const vertices = new Float32Array([
      -1, 1, -1, -1, -1, -1, 1, -1, -1, 1, -1, -1, 1, 1, -1, -1, 1, -1, -1, -1,
      1, -1, -1, -1, -1, 1, -1, -1, 1, -1, -1, 1, 1, -1, -1, 1, 1, -1, -1, 1,
      -1, 1, 1, 1, 1, 1, 1, 1, 1, 1, -1, 1, -1, -1, -1, -1, 1, -1, 1, 1, 1, 1,
      1, 1, 1, 1, 1, -1, 1, -1, -1, 1, -1, 1, -1, 1, 1, -1, 1, 1, 1, 1, 1, 1,
      -1, 1, 1, -1, 1, -1, -1, -1, -1, -1, -1, 1, 1, -1, -1, 1, -1, -1, -1, -1,
      1, 1, -1, 1,
    ]);

    this._vao = gl.createVertexArray();
    const vbo = gl.createBuffer();
    gl.bindVertexArray(this._vao);
    gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
    gl.enableVertexAttribArray(0);
    gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 0, 0);
    gl.bindVertexArray(null);
  }

  public async loadShader() {
    const manager = ResourceManager.getInstance();
    this._shader = manager.getResource(
      "skybox",
      resourceType.shader,
    ) as ShaderResource;
    const ok = await this._shader.loadResource("skybox");
  }

  public override render(modelMatrix: mat4, context: RenderContext): void {
    const gl = FacadeWebgl._gl;
    if (!this._shader || !context.envMap) return;

    gl.disable(gl.DEPTH_TEST);
    gl.disable(gl.CULL_FACE);

    this._shader.use();

    this._shader.setUniform("u_view", context.viewMatrix);
    this._shader.setUniform("u_projection", context.projectionMatrix);

    this._shader.setTextureCube("u_cube", context.envMap.texture, 8);

    gl.bindVertexArray(this._vao);
    gl.drawArrays(gl.TRIANGLES, 0, 36);

    gl.bindVertexArray(null);
    gl.enable(gl.DEPTH_TEST);
    gl.enable(gl.CULL_FACE);
  }

  public override update(deltaTime: number, node: any): void {}
  public override destroy(): void {}
}
