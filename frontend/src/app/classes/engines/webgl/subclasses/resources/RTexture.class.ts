import { FacadeWebgl } from "../../interface-webgl.class";
import { Resource } from "../utilities/Resource.class";

export class TextureResource extends Resource {
  private _texture: WebGLTexture | null = null;
  private _isLoaded: boolean = false;
  private _loadingPromise: Promise<boolean> | null = null;

  constructor(name: string) {
    super(name);
  }

  public get texture(): WebGLTexture | null {
    return this._texture;
  }

  public override async loadResource(name: string): Promise<boolean> {
    if (this._isLoaded) return true;
    if (this._loadingPromise) return this._loadingPromise;
    
    this._loadingPromise = this._internalLoad(name);
    return this._loadingPromise;
  }

  private async _internalLoad(path: string): Promise<boolean> {
    const gl = FacadeWebgl._gl;

    if (!this._texture) {
      this._texture = gl.createTexture();
      if (!this._texture) return false;
      this.loadFallback(this._texture);
    }

    try {
      const response = await fetch(path);
      if (!response.ok)
        throw new Error(`HTTP error! status: ${response.status}`);

      const blob = await response.blob();

      const imageBitmap = await createImageBitmap(blob, {
        premultiplyAlpha: "none",
        colorSpaceConversion: "none",
      });

      gl.bindTexture(gl.TEXTURE_2D, this._texture);

      gl.texImage2D(
        gl.TEXTURE_2D,
        0,
        gl.RGBA,
        gl.RGBA,
        gl.UNSIGNED_BYTE,
        imageBitmap,
      );

      const isPOT =
        this.isPowerOf2(imageBitmap.width) &&
        this.isPowerOf2(imageBitmap.height);
      this.setTextureParameters(isPOT);

      gl.bindTexture(gl.TEXTURE_2D, null);

      imageBitmap.close();

      this._isLoaded = true;
      this._loadingPromise = null;
      return true;
    } catch (error) {
      this._loadingPromise = null;
      return false;
    }
  }

  private setTextureParameters(isPOT: boolean): void {
    const gl = FacadeWebgl._gl;
    if (isPOT) {
      gl.generateMipmap(gl.TEXTURE_2D);
      gl.texParameteri(
        gl.TEXTURE_2D,
        gl.TEXTURE_MIN_FILTER,
        gl.LINEAR_MIPMAP_LINEAR,
      );
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
    } else {
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    }
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  }

  private loadFallback(texture: WebGLTexture): void {
    const gl = FacadeWebgl._gl;
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texImage2D(
      gl.TEXTURE_2D,
      0,
      gl.RGBA,
      1,
      1,
      0,
      gl.RGBA,
      gl.UNSIGNED_BYTE,
      new Uint8Array([127, 127, 127, 255]),
    );
    gl.bindTexture(gl.TEXTURE_2D, null);
  }

  private isPowerOf2(value: number): boolean {
    return value > 0 && (value & (value - 1)) === 0;
  }

  public override destroyResource(): void {
    if (this._texture) {
      FacadeWebgl._gl.deleteTexture(this._texture);
      this._texture = null;
      this._isLoaded = false;
    }
  }
}
