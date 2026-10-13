import { vec3, vec4 } from "gl-matrix";
import { Resource } from "../utilities/Resource.class";
import { ResourceManager, resourceType } from "../utilities/ResourceManager.class";
import { TextureResource } from "./RTexture.class";
import { ShaderResource } from "./RShader.class";
import { presets } from "../../../../../../../public/materials/material_presets";
import { MaterialDefinition } from "../../../../../interfaces/threejs/materialDefinition.interface";

const TYPE_SHADER_MAP: Record<string, string> = {
  standard: 'pbr',     
  phong:    'refractive',
};

const SHADER_NAME_MAP: Record<string, string> = {
  map:               "u_AlbedoMap",
  normalMap:         "u_NormalMap",
  roughnessMap:      "u_RoughnessMap",
  metalnessMap:      "u_MetallicMap",
  aoMap:             "u_AOMap",
  color:             "u_color",
  metalness:         "u_metalness",
  roughness:         "u_roughness",
  emissive:          "u_emissive",
  emissiveIntensity: "u_emissiveIntensity",
  envMapIntensity:   "u_envMapIntensity",
  cameraPos:         "u_cameraPos",
  ior:               "u_ior",
  absorptionColor:   "u_absorptionColor",
  aberrationStrength: "u_aberrationStrength",
  fresnelStrength:    "u_fresnelStrength",
  bounces:            "u_bounces",
  opacity:            "u_opacity"
};

export class MaterialResource extends Resource {

  private _shader: ShaderResource | null = null;
  private _textures = new Map<string, TextureResource>();
  private _properties = new Map<string, any>();

  private readonly _valueProcessors: Record<string, (v: any) => any> = {
    u_color:    (v) => this._hexToColorVector(v),
    u_emissive: (v) => this._hexToColorVector(v),
  };

  constructor(name: string) {
    super(name);
  }

  public get shader(): ShaderResource {
    if (!this._shader) {
      throw new Error(
        `[MaterialResource] El material '${this.name}' no tiene un shader asignado. ` +
        `¿Olvidaste llamar a 'await loadResource()'?`
      );
    }
    return this._shader;
  }

 public override async loadResource(name: string): Promise<boolean> {
    const preset = (presets as Record<string, MaterialDefinition>)[name];
    if (!preset) throw new Error(`Preset '${name}' no encontrado.`);

    const shaderName = TYPE_SHADER_MAP[preset.materialType];
    await this.setShader(shaderName);

    await Promise.all([
      this._setupTextures(preset.textures),
      this._setupOptions(preset.options),
    ]);

    return true;
  }

  public override destroyResource(): void {
    this._textures.clear();
    this._properties.clear();
    this._shader = null; 
  }

  public bind(): void {
    const shader = this.shader;
    shader.use();

    let unit = 0;
    
    this._textures.forEach((res, uniformName) => {
      shader.setTexture2D(uniformName, res.texture, unit);
      unit++; 
    });

    this._properties.forEach((value, uniformName) => {
      shader.setUniform(uniformName, value);
    });
  }

  public async setShader(shaderName: string): Promise<void> {
    const rm = ResourceManager.getInstance();
    const newShader = rm.getResource(shaderName, resourceType.shader) as ShaderResource;
    
    await newShader.loadResource(shaderName);
    this._shader = newShader;
  }

  public async setModelType(type: string): Promise<void> {
    const shaderFile = TYPE_SHADER_MAP[type];
    if (shaderFile) {
      await this.setShader(shaderFile);
    }
  }

  public setProperty(name: string, value: any): void {
    const processor = this._valueProcessors[name] || ((v) => v);
    this._properties.set(name, processor(value));
  }

  private async _setupTextures(textures?: Record<string, string>): Promise<void> {
    if (!textures) return;

    const rm = ResourceManager.getInstance();

    const tasks = Object.entries(textures).map(async ([key, path]) => {
      const uniformName = SHADER_NAME_MAP[key] || key;
      const res = rm.getResource("/textures" + path, resourceType.texture) as TextureResource;

      await res.loadResource(res.getName());
      this._textures.set(uniformName, res);
    });

    await Promise.all(tasks);
  }

  private _setupOptions(options?: Record<string, any>): void {
    if (!options) return;

    Object.entries(options).forEach(([key, value]) => {
      const uniformName = SHADER_NAME_MAP[key] || key;
      this.setProperty(uniformName, value);
    });
  }

  private _hexToColorVector(hex: number): vec3 {
    const hexString = hex.toString(16).padStart(6, "0");
    const red = parseInt(hexString.slice(0, 2), 16) / 255;
    const green = parseInt(hexString.slice(2, 4), 16) / 255;
    const blue = parseInt(hexString.slice(4, 6), 16) / 255;
    return vec3.fromValues(red, green, blue);
  }

  public get isReady(): boolean {
    return this._shader !== null;
  }
}