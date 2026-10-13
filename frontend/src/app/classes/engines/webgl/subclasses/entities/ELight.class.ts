import { mat4, vec3 } from "gl-matrix";
import { IEntity } from "./IEntity.class";
import { TNode } from "../utilities/TNode.class";
export enum LightType {
  POINT,
  DIRECTIONAL,
  SPOT,
  AMBIENT,
}

export abstract class LightEntityBase extends IEntity {
  protected _color: vec3;
  protected _intensity: number;
  protected _type: LightType;

  constructor(type: LightType, colorHex: number, intensity: number) {
    super();
    this._type = type;
    this._color = LightEntityBase._hexToColorVector(colorHex);
    this._intensity = intensity;
  }

  public get type(): LightType {
    return this._type;
  }
  public get color(): vec3 {
    return this._color;
  }
  public get intensity(): number {
    return this._intensity;
  }

  public extractPosition(matrix: mat4): vec3 {
    return vec3.fromValues(matrix[12], matrix[13], matrix[14]);
  }

  public extractDirection(matrix: mat4): vec3 {
    const dir = vec3.fromValues(-matrix[8], -matrix[9], -matrix[10]);
    return vec3.normalize(dir, dir);
  }

  private static _hexToColorVector(hex: number): vec3 {
    const hexString = hex.toString(16).padStart(6, "0");
    const red = parseInt(hexString.slice(0, 2), 16) / 255;
    const green = parseInt(hexString.slice(2, 4), 16) / 255;
    const blue = parseInt(hexString.slice(4, 6), 16) / 255;
    return vec3.fromValues(red, green, blue);
  }

  public abstract override render(mat: mat4): void;
  public abstract override destroy(): void;
}

export class AmbientLight extends LightEntityBase {
  constructor(colorHex = 0xffffff, intensity = 0.1) {
    super(LightType.AMBIENT, colorHex, intensity);
  }
  public render(mat: mat4): void {}
  public destroy(): void {}
  public update (): void {}
}

export class DirectionalLight extends LightEntityBase {
  constructor(colorHex = 0xffffff, intensity = 1.0) {
    super(LightType.DIRECTIONAL, colorHex, intensity);
  }
  public render(mat: mat4): void {}
  public destroy(): void {}
  public update (): void {}
}

export class PointLight extends LightEntityBase {
  public distance: number;
  public decay: number;

  constructor(colorHex = 0xffffff, intensity = 1.0, distance = 0, decay = 2.0) {
    super(LightType.POINT, colorHex, intensity);
    this.distance = distance;
    this.decay = decay;
  }

  public render(mat: mat4): void {}
  public destroy(): void {}
  public update (): void {}
}

export class SpotLight extends LightEntityBase {
  public distance: number;
  public decay: number;
  public cutoff: number;
  public outerCutoff: number;

  constructor(
    colorHex = 0xffffff,
    intensity = 1.0,
    cut = 12.5,
    outer = 17.5,
    distance = 0,
    decay = 2.0,
  ) {
    super(LightType.SPOT, colorHex, intensity);

    this.distance = distance;
    this.decay = decay;
    this.cutoff = Math.cos((cut * Math.PI) / 180);
    this.outerCutoff = Math.cos((outer * Math.PI) / 180);
  }

  public override render(mat: mat4): void {}

  public override update(deltaTime: number, node: TNode): void {
    // Las luces son estáticas por defecto.
  }

  public override extractDirection(mat: mat4): vec3 {
    const direction = vec3.create();
    const rotMat = mat4.clone(mat);
    rotMat[12] = rotMat[13] = rotMat[14] = 0;
    vec3.transformMat4(direction, vec3.fromValues(0, 0, -1), rotMat);
    return vec3.normalize(direction, direction);
  }

  private static hexToVec3(hex: number): vec3 {
    return vec3.fromValues(
      ((hex >> 16) & 255) / 255,
      ((hex >> 8) & 255) / 255,
      (hex & 255) / 255,
    );
  }

  public override destroy(): void {}
}
