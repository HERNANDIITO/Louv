import { Resource } from "../utilities/Resource.class";
import { FacadeWebgl } from "../../interface-webgl.class";

export class CubemapResource extends Resource {
  private _texture: WebGLTexture | null = null;
  private _loaded: boolean = false;

  constructor(name: string) {
    super(name);
  }

  public get texture(): WebGLTexture | null {
    return this._texture;
  }

  public get isLoaded(): boolean {
    return this._loaded;
  }

  public async loadResource(path: string): Promise<boolean> {
    const gl = FacadeWebgl._gl;
    const targets = [
      gl.TEXTURE_CUBE_MAP_POSITIVE_X,
      gl.TEXTURE_CUBE_MAP_NEGATIVE_X,
      gl.TEXTURE_CUBE_MAP_POSITIVE_Y,
      gl.TEXTURE_CUBE_MAP_NEGATIVE_Y,
      gl.TEXTURE_CUBE_MAP_POSITIVE_Z,
      gl.TEXTURE_CUBE_MAP_NEGATIVE_Z,
    ];
    const sideSuffixes = [
      "px.png",
      "nx.png",
      "py.png",
      "ny.png",
      "pz.png",
      "nz.png",
    ];

    const texture = gl.createTexture();
    if (!texture) return false;
    this._texture = texture;

    try {
      await Promise.all(
        sideSuffixes.map((suffix, i) => {
          return new Promise<void>((resolve, reject) => {
            const image = new Image();
            image.onload = () => {
              gl.bindTexture(gl.TEXTURE_CUBE_MAP, texture);
              gl.texImage2D(
                targets[i],
                0,
                gl.RGBA,
                gl.RGBA,
                gl.UNSIGNED_BYTE,
                image,
              );
              resolve();
            };
            image.onerror = () => reject(new Error(`Error cara: ${suffix}`));
            image.src = `${path}/${suffix}`;
          });
        }),
      );

      gl.bindTexture(gl.TEXTURE_CUBE_MAP, texture);
      gl.generateMipmap(gl.TEXTURE_CUBE_MAP);
      gl.texParameteri(
        gl.TEXTURE_CUBE_MAP,
        gl.TEXTURE_MIN_FILTER,
        gl.LINEAR_MIPMAP_LINEAR,
      );
      gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texParameteri(
        gl.TEXTURE_CUBE_MAP,
        gl.TEXTURE_WRAP_S,
        gl.CLAMP_TO_EDGE,
      );
      gl.texParameteri(
        gl.TEXTURE_CUBE_MAP,
        gl.TEXTURE_WRAP_T,
        gl.CLAMP_TO_EDGE,
      );
      gl.texParameteri(
        gl.TEXTURE_CUBE_MAP,
        gl.TEXTURE_WRAP_R,
        gl.CLAMP_TO_EDGE,
      );

      gl.bindTexture(gl.TEXTURE_CUBE_MAP, null);
      this._loaded = true;
      return true;
    } catch (error) {
      return false;
    }
  }

  public override destroyResource(): void {
    if (this._texture) {
      FacadeWebgl._gl.deleteTexture(this._texture);
      this._texture = null;
      this._loaded = false;
    }
  }
}
