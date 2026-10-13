// RenderContext.class.ts
import { mat4, vec3 } from "gl-matrix";
import { LightEntityBase, LightType } from "../entities/ELight.class";
import { CubemapResource } from "../resources/RCubeMap.class";
import { ShaderResource } from "../resources/RShader.class";
import { TNode } from "./TNode.class";

export interface LightRenderData {
  entity: LightEntityBase;
  worldMatrix: mat4;
}

export class RenderContext {
  public isShadowPass: boolean = false;
  public shadowMatrix: mat4 = mat4.create();
  public shadowShader: ShaderResource | null = null;
  public isPickingPass: boolean = false;
  public pickingShader: ShaderResource | null = null;
  public pickingColor: vec3 = vec3.fromValues(0, 0, 0);
  public isOutlinePass: boolean = false;
  public outlineShader: ShaderResource | null = null;
  public selectedNode: TNode | null = null;
  public ambient: LightRenderData | null = null;
  public points: LightRenderData[] = [];
  public dirs: LightRenderData[] = [];
  public spots: LightRenderData[] = [];
  public time: number = 0;

  constructor(
    public viewMatrix: mat4,
    public projectionMatrix: mat4,
    public cameraPos: vec3,
    public envMap?: CubemapResource,
  ) {}

  public addLight(entity: LightEntityBase, worldMatrix: mat4): void {
    const data = { entity, worldMatrix };

    switch (entity.type) {
      case LightType.AMBIENT:
        this.ambient = data;
        break;
      case LightType.POINT:
        this.points.push(data);
        break;
      case LightType.DIRECTIONAL:
        this.dirs.push(data);
        break;
      case LightType.SPOT:
        this.spots.push(data);
        break;
    }
  }
}
