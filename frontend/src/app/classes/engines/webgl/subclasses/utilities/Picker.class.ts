import { mat4, vec3 } from "gl-matrix";
import { FacadeWebgl } from "../../interface-webgl.class";
import { TNode } from "./TNode.class";
import { RenderContext } from "./RenderContext.class";

export class Picker {
  private _fbo: WebGLFramebuffer | null = null;
  private _targetTexture: WebGLTexture | null = null;
  private _depthBuffer: WebGLRenderbuffer | null = null;

  private _idToNode: Map<number, TNode> = new Map();
  private _nextId = 1;

  constructor() {}

  public init(gl: WebGL2RenderingContext, width: number, height: number) {
    this._fbo = gl.createFramebuffer();
    gl.bindFramebuffer(gl.FRAMEBUFFER, this._fbo);

    this._targetTexture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, this._targetTexture);
    gl.texImage2D(
      gl.TEXTURE_2D,
      0,
      gl.RGBA,
      width,
      height,
      0,
      gl.RGBA,
      gl.UNSIGNED_BYTE,
      null,
    );
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);

    this._depthBuffer = gl.createRenderbuffer();
    gl.bindRenderbuffer(gl.RENDERBUFFER, this._depthBuffer);
    gl.renderbufferStorage(
      gl.RENDERBUFFER,
      gl.DEPTH_COMPONENT16,
      width,
      height,
    );

    gl.framebufferTexture2D(
      gl.FRAMEBUFFER,
      gl.COLOR_ATTACHMENT0,
      gl.TEXTURE_2D,
      this._targetTexture,
      0,
    );
    gl.framebufferRenderbuffer(
      gl.FRAMEBUFFER,
      gl.DEPTH_ATTACHMENT,
      gl.RENDERBUFFER,
      this._depthBuffer,
    );

    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
  }

  public registerNode(node: TNode): number {
    const id = this._nextId++;
    this._idToNode.set(id, node);
    return id;
  }

  public idToColor(id: number): vec3 {
    return vec3.fromValues(
      ((id >> 0) & 0xff) / 255.0,
      ((id >> 8) & 0xff) / 255.0,
      ((id >> 16) & 0xff) / 255.0,
    );
  }

  public pick(gl: WebGL2RenderingContext, x: number, y: number): TNode | null {
    gl.bindFramebuffer(gl.FRAMEBUFFER, this._fbo);

    const data = new Uint8Array(4);
    gl.readPixels(
      x,
      gl.drawingBufferHeight - y,
      1,
      1,
      gl.RGBA,
      gl.UNSIGNED_BYTE,
      data,
    );

    gl.bindFramebuffer(gl.FRAMEBUFFER, null);

    const id = data[0] + (data[1] << 8) + (data[2] << 16);
    return this._idToNode.get(id) || null;
  }

  public clear() {
    this._idToNode.clear();
    this._nextId = 1;
  }
}
