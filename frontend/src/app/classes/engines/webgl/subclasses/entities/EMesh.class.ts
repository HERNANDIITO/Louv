import { mat4, mat3 } from "gl-matrix";
import { IEntity } from "./IEntity.class";
import { MeshResource } from "../resources/RMesh.class";
import { FacadeWebgl } from "../../interface-webgl.class";
import {
  ResourceManager,
  resourceType,
} from "../utilities/ResourceManager.class";
import { MaterialResource } from "../resources/RMaterial.class";
import { RenderContext } from "../utilities/RenderContext.class";
import { TNode } from "../utilities/TNode.class";
import { AABBEntity } from "./EBoundingBox.class";

export class MeshEntity extends IEntity {
  private mesh: MeshResource;
  private material: MaterialResource | null = null;
  private debugBounds: AABBEntity[] = [];
  public static showDebug = false;
  private modelPath: string = "";

  constructor(name: string) {
    super();
    this.mesh = ResourceManager.getInstance().getResource(
      name,
      resourceType.mesh,
    ) as MeshResource;
  }

  public async loadResource(name: string): Promise<void> {
    await this.mesh.loadResource(name);
    this.debugBounds = this.mesh.bounds.map(
      (b) => new AABBEntity(b.min, b.max),
    );
  }

  public async setMaterial(name: string): Promise<void> {
    this.material = ResourceManager.getInstance().getResource(
      name,
      resourceType.material,
    ) as MaterialResource;
    await this.material.loadResource(name);
  }

  public override render(modelMatrix: mat4, context: RenderContext): void {
    if (!this.mesh.getVAO()) return;
    if (context.isPickingPass && context.pickingShader) {
      const s = context.pickingShader;
      s.use();
      s.setUniform("u_model", modelMatrix);
      s.setUniform("u_view", context.viewMatrix);
      s.setUniform("u_projection", context.projectionMatrix);
      s.setUniform("u_idColor", context.pickingColor);
      this._draw();
      return;
    } else if (context.isOutlinePass && context.outlineShader) {
      const s = context.outlineShader;
      const gl = FacadeWebgl._gl;

      s.use();
      s.setUniform("u_model", modelMatrix);
      s.setUniform("u_view", context.viewMatrix);
      s.setUniform("u_projection", context.projectionMatrix);

      s.setUniform("u_outlineColor", [0.337, 0.129, 0.447]);
      s.setUniform("u_thickness", 0.0075);

      const aspect = gl.canvas.width / gl.canvas.height;
      s.setUniform("u_aspect", aspect);

      gl.enable(gl.CULL_FACE);
      gl.cullFace(gl.BACK);

      this._draw();
    } else if (context.isShadowPass && context.shadowShader) {
      const s = context.shadowShader;
      s.use();
      s.setUniform("u_model", modelMatrix);
      s.setUniform("u_view", context.viewMatrix);
      s.setUniform("u_projection", context.projectionMatrix);
      s.setUniform("u_shadowMatrix", context.shadowMatrix);
      this._draw();
    } else {
      if (!this.material || !this.material.isReady) return;
      const shader = this.material.shader;
      shader.setGlobalUniforms(context);
      this.material.bind();
      this._uploadMatrices(shader, modelMatrix);
      this._draw();
      if (MeshEntity.showDebug) {
        for (const box of this.debugBounds) {
          box.render(modelMatrix, context);
        }
      }
    }
  }

  private _uploadMatrices(shader: any, modelMatrix: mat4): void {
    const normalMatrix = mat3.create();
    mat3.fromMat4(normalMatrix, modelMatrix);
    mat3.invert(normalMatrix, normalMatrix);
    mat3.transpose(normalMatrix, normalMatrix);

    shader.setUniform("u_model", modelMatrix);
    shader.setUniform("u_normalMatrix", normalMatrix);
  }

  private _draw(): void {
    const gl = FacadeWebgl._gl;
    gl.bindVertexArray(this.mesh.getVAO());
    gl.drawElements(
      gl.TRIANGLES,
      this.mesh.getIndexCount(),
      gl.UNSIGNED_INT,
      0,
    );
    gl.bindVertexArray(null);
  }
  public override update(deltaTime: number, node: TNode): void {
    this.debugBounds.forEach((b) => b.update(deltaTime, node));
  }

  public override destroy(): void {
    this.mesh = null!;
    this.material = null!;
    this.debugBounds.forEach((b) => b.destroy());
  }

  public getModelPath() {
    return this.modelPath;
  }
  public setModelPath(path: string) {
    this.modelPath = path;
  }
}
