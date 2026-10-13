import { mat4, vec3 } from "gl-matrix";
import { Resource } from "../utilities/Resource.class";
import { FacadeWebgl } from "../../interface-webgl.class";
import { RenderContext } from "../utilities/RenderContext.class";
import {
  DirectionalLight,
  PointLight,
  SpotLight,
} from "../entities/ELight.class";

export class ShaderResource extends Resource {
  private _program: WebGLProgram | null = null;
  private _uniformSetters = new Map<string, (v: any) => void>();

  constructor(name: string) {
    super(name);
  }

  public setGlobalUniforms(context: RenderContext): void {
    this.use();

    this.setUniform("u_view", context.viewMatrix);
    this.setUniform("u_projection", context.projectionMatrix);
    this.setUniform("u_cameraPos", context.cameraPos);

    this.setUniform("u_time", context.time);

    if (context.envMap && context.envMap.texture) {
      this.setTextureCube("u_cube", context.envMap.texture, 8);
    }

    this._uploadLights(context);
  }

  public setUniform(name: string, value: any): void {
    const setter = this._uniformSetters.get(name);
    if (setter) {
      setter(value);
    }
  }

  public use(): void {
    if (this._program) {
      FacadeWebgl._gl.useProgram(this._program);
    }
  }

  public setTexture2D(name: string, texture: WebGLTexture | null, unit: number = 0): void {
    const gl = FacadeWebgl._gl;
    this.setUniform(name, unit); 
    if (texture) {
      gl.activeTexture(gl.TEXTURE0 + unit);
      gl.bindTexture(gl.TEXTURE_2D, texture);
    }
  }

  public setTextureCube(name: string, texture: WebGLTexture | null, unit: number = 8): void {
    const gl = FacadeWebgl._gl;
    this.setUniform(name, unit);
    if (texture) {
      gl.activeTexture(gl.TEXTURE0 + unit);
      gl.bindTexture(gl.TEXTURE_CUBE_MAP, texture);
    }
  }

  private _uploadLights(ctx: RenderContext): void {
    if (ctx.ambient) {
      this.setUniform("u_ambientLight.color", ctx.ambient.entity.color);
      this.setUniform("u_ambientLight.intensity", ctx.ambient.entity.intensity);
    } else {
      this.setUniform("u_ambientLight.color", [0, 0, 0]);
      this.setUniform("u_ambientLight.intensity", 0.0);
    }

    const numPoints = Math.min(ctx.points.length, 4);
    for (let i = 0; i < numPoints; i++) {
      const { entity, worldMatrix } = ctx.points[i];
      const ent = entity as PointLight;

      this.setUniform(`u_pointLights[${i}].position`, ent.extractPosition(worldMatrix));
      this.setUniform(`u_pointLights[${i}].color`, ent.color);
      this.setUniform(`u_pointLights[${i}].intensity`, ent.intensity);
      this.setUniform(`u_pointLights[${i}].distance`, ent.distance);
      this.setUniform(`u_pointLights[${i}].decay`, ent.decay);
    }
    this.setUniform("u_pointLightCount", numPoints);

    const numDirs = Math.min(ctx.dirs.length, 4);
    for (let i = 0; i < numDirs; i++) {
      const { entity, worldMatrix } = ctx.dirs[i];
      const ent = entity as DirectionalLight;

      this.setUniform(`u_dirLights[${i}].direction`, ent.extractDirection(worldMatrix));
      this.setUniform(`u_dirLights[${i}].color`, ent.color);
      this.setUniform(`u_dirLights[${i}].intensity`, ent.intensity);
    }
    this.setUniform("u_dirLightCount", numDirs);

    const numSpots = Math.min(ctx.spots.length, 4);
    for (let i = 0; i < numSpots; i++) {
      const { entity, worldMatrix } = ctx.spots[i];
      const ent = entity as SpotLight;

      this.setUniform(`u_spotLights[${i}].position`, ent.extractPosition(worldMatrix));
      this.setUniform(`u_spotLights[${i}].direction`, ent.extractDirection(worldMatrix));
      this.setUniform(`u_spotLights[${i}].color`, ent.color);
      this.setUniform(`u_spotLights[${i}].intensity`, ent.intensity);
      this.setUniform(`u_spotLights[${i}].distance`, ent.distance);
      this.setUniform(`u_spotLights[${i}].decay`, ent.decay);
      this.setUniform(`u_spotLights[${i}].cutoff`, ent.cutoff);
      this.setUniform(`u_spotLights[${i}].outerCutoff`, ent.outerCutoff);
    }
    this.setUniform("u_spotLightCount", numSpots);
  }

  public override async loadResource(name: string): Promise<boolean> {
    const [vsSource, fsSource] = await Promise.all([
      this._loadFile(`/shaders/${name}.vert`),
      this._loadFile(`/shaders/${name}.frag`),
    ]);

    if (!vsSource || !fsSource) return false;

    const gl = FacadeWebgl._gl;
    const vs = this._compileShader(gl.VERTEX_SHADER, vsSource);
    const fs = this._compileShader(gl.FRAGMENT_SHADER, fsSource);

    if (vs && fs) {
      this._program = this._linkProgram(vs, fs);
      if (this._program) {
        this._createUniformSetters();
      }
      gl.deleteShader(vs);
      gl.deleteShader(fs);
      return this._program !== null;
    }

    return false;
  }

  public override destroyResource(): void {
    if (this._program) {
      FacadeWebgl._gl.deleteProgram(this._program);
      this._program = null;
    }
    this._uniformSetters.clear();
  }

  private _createUniformSetters(): void {
    const gl = FacadeWebgl._gl;
    const count = gl.getProgramParameter(this._program!, gl.ACTIVE_UNIFORMS);

    for (let i = 0; i < count; i++) {
      const info = gl.getActiveUniform(this._program!, i);
      if (!info) continue;

      const loc = gl.getUniformLocation(this._program!, info.name);
      if (!loc) continue;

      this._uniformSetters.set(info.name, this._makeSetter(info.type, loc));
    }
  }

  private _makeSetter(type: number, loc: WebGLUniformLocation): (v: any) => void {
    const gl = FacadeWebgl._gl;

    switch (type) {
      case gl.FLOAT:        return (v) => gl.uniform1f(loc, v);
      case gl.FLOAT_VEC3:   return (v) => gl.uniform3fv(loc, v);
      case gl.FLOAT_MAT4:   return (v) => gl.uniformMatrix4fv(loc, false, v);
      case gl.FLOAT_MAT3:   return (v) => gl.uniformMatrix3fv(loc, false, v);
      case gl.INT:
      case gl.BOOL:
      case gl.SAMPLER_2D:
      case gl.SAMPLER_CUBE: return (v) => gl.uniform1i(loc, v);
      default:              return (v) => console.warn(`Uniform type ${type} no soportado`);
    }
  }

  private _compileShader(type: number, source: string): WebGLShader | null {
    const gl = FacadeWebgl._gl;
    const shader = gl.createShader(type);
    if (!shader) return null;
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      gl.deleteShader(shader);
      return null;
    }
    return shader;
  }

  private _linkProgram(vs: WebGLShader, fs: WebGLShader): WebGLProgram | null {
    const gl = FacadeWebgl._gl;
    const program = gl.createProgram();
    if (!program) return null;
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      gl.deleteProgram(program);
      return null;
    }
    return program;
  }

  private async _loadFile(url: string): Promise<string | null> {
    try {
      const response = await fetch(url);
      return response.ok ? await response.text() : null;
    } catch (e) {
      return null;
    }
  }
}