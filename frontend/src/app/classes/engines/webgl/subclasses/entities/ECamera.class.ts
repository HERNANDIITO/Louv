import { mat4 } from "gl-matrix";
import { IEntity } from "./IEntity.class";
import { RenderContext } from "../utilities/RenderContext.class";
import { TNode } from "../utilities/TNode.class";

export class CameraEntity extends IEntity {
  private isPerspective: boolean;
  private near: number;
  private far: number;

  // Parámetros Cámara Ortográfica
  private left: number;
  private right: number;
  private top: number;
  private bottom: number;

  // Parámetros Cámara Perspectiva
  private fov: number;
  private aspect: number;

  private projectionMatrix: mat4;

  constructor(aspect: number, isPerspective: boolean = true) {
    super();

    this.isPerspective = isPerspective;
    this.near = 0.01;
    this.far = 10.0;

    const frustumSize = 0.03;
    this.left = -frustumSize * aspect;
    this.right = frustumSize * aspect;
    this.top = frustumSize;
    this.bottom = -frustumSize;

    this.fov = (30 * Math.PI) / 180;
    this.aspect = aspect;

    this.projectionMatrix = mat4.create();
    this.updateProjectionMatrix();
  }

  public updateProjectionMatrix(): void {
    if (this.isPerspective) {
      mat4.perspective(this.projectionMatrix, this.fov, this.aspect, this.near, this.far);
    } else {
      mat4.ortho(this.projectionMatrix, this.left, this.right, this.bottom, this.top, this.near, this.far);
    }
  }

  public setPerspective(): void {
    const newFov = this.top * 1000;
    this.isPerspective = true;
    this.fov = newFov; 
    this.updateProjectionMatrix();
  }

  public setParallel(): void {
    const newFrustumSize = this.fov / 1000;
    this.isPerspective = false;
    
    this.top = newFrustumSize;
    this.bottom = -newFrustumSize;
    this.left = -newFrustumSize * this.aspect;
    this.right = newFrustumSize * this.aspect;

    this.updateProjectionMatrix();
  }

  public updatePerspective(fov?: number, aspect?: number, near?: number, far?: number): void {
    this.fov = fov ?? this.fov;
    this.aspect = aspect ?? this.aspect;
    this.near = near ?? this.near;
    this.far = far ?? this.far;
    this.updateProjectionMatrix();
  }

  public updateParallel(left?: number, right?: number, bottom?: number, top?: number, near?: number, far?: number): void {
    this.left = left ?? this.left;
    this.right = right ?? this.right;
    this.bottom = bottom ?? this.bottom;
    this.top = top ?? this.top;
    this.near = near ?? this.near;
    this.far = far ?? this.far;
    this.updateProjectionMatrix();
  }

  public resize(aspect: number): void {
    this.aspect = aspect;
    if (!this.isPerspective) {
      this.left = -this.top * aspect;
      this.right = this.top * aspect;
    }
    this.updateProjectionMatrix();
  }

  public getProjectionMatrix(): mat4 {
    return this.projectionMatrix;
  }

  public getIsPerspective(): boolean {
    return this.isPerspective;
  }

  public getTop(): number {
    return this.top;
  }

  public getAspect(): number {
    return this.aspect;
  }

  public setNear(v: number): void { this.near = v; }
  public setFar(v: number): void { this.far = v; }
  public setFov(deg: number): void { this.fov = (deg * Math.PI) / 180; }
  public setTop(v: number): void { this.top = v; }

  public override update(deltaTime: number, node: TNode): void {
    // La cámara mantiene su transform y no necesita cambios por defecto.
  }

  public override render(modelMatrix: mat4, context: RenderContext): void {

  }

  public override destroy(): void {

  }
}
