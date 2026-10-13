import { Resource } from "../utilities/Resource.class";
import { assetHelper } from "../../../../../helpers/asset.helper";
import { FacadeWebgl } from "../../interface-webgl.class";
import { vec3 } from "gl-matrix";

export interface MeshBounds {
  min: vec3;
  max: vec3;
}

export class MeshResource extends Resource {
  private vertices: Float32Array = new Float32Array();
  private normals: Float32Array = new Float32Array();
  private uvs: Float32Array = new Float32Array();
  private tangents: Float32Array = new Float32Array();
  private faces: Uint32Array = new Uint32Array();
  private meshBounds: MeshBounds[] = [];

  private vertexBuffer!: WebGLBuffer;
  private normalBuffer!: WebGLBuffer;
  private uvBuffer!: WebGLBuffer;
  private tangentBuffer!: WebGLBuffer;
  private facesBuffer!: WebGLBuffer;

  private vao!: WebGLVertexArrayObject;

  constructor(name: string) {
    super(name);
  }

  public getVAO(): WebGLVertexArrayObject {
    return this.vao;
  }

  public getVertexCount(): number {
    return this.vertices.length / 3;
  }

  public getIndexCount(): number {
    return this.faces.length;
  }

  public override async loadResource(name: string): Promise<boolean> {
    const assetRoute = assetHelper.getRouteByName(name, "webgl");

    try {
      if (!assetRoute) throw new Error(`Route not found: ${name}`);

      const res = await fetch(assetRoute);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const data = await res.json();

      const verticesList: number[][] = [];
      const normalsList: number[][] = [];
      const uvsList: number[][] = [];
      const tangentsList: number[][] = [];
      const facesList: number[][] = [];
      let vertexOffset = 0;

      for (const mesh of data.meshes) {
        verticesList.push(mesh.vertices);
        normalsList.push(mesh.normals);

        if (mesh.texturecoords?.[0]) {
          uvsList.push(mesh.texturecoords[0]);
        }

        if (mesh.tangents) {
          tangentsList.push(mesh.tangents);
        }

        if (mesh.boundingBox) {
          this.meshBounds.push({
            min: vec3.fromValues(
              mesh.boundingBox.min[0],
              mesh.boundingBox.min[1],
              mesh.boundingBox.min[2],
            ),
            max: vec3.fromValues(
              mesh.boundingBox.max[0],
              mesh.boundingBox.max[1],
              mesh.boundingBox.max[2],
            ),
          });
        }

        const flattenedFaces = mesh.faces
          .flat()
          .map((index: number) => index + vertexOffset);
        facesList.push(flattenedFaces);

        vertexOffset += mesh.vertices.length / 3;
      }

      this.vertices = this.concatToFloat32(verticesList);
      this.normals = this.concatToFloat32(normalsList);
      this.uvs = this.concatToFloat32(uvsList);
      this.tangents = this.concatToFloat32(tangentsList);
      this.faces = this.concatToUint32(facesList);

      this.uploadToGPU();
      return true;
    } catch (err) {
      return false;
    }
  }

  public uploadToGPU(): void {
    const gl = FacadeWebgl._gl;

    this.vao = gl.createVertexArray()!;
    gl.bindVertexArray(this.vao);

    this.vertexBuffer = this.createStaticBuffer(gl, this.vertices, 0, 3);
    this.normalBuffer = this.createStaticBuffer(gl, this.normals, 1, 3);

    if (this.uvs.length > 0) {
      this.uvBuffer = this.createStaticBuffer(gl, this.uvs, 2, 2);
    } else {
      gl.disableVertexAttribArray(2);
    }

    if (this.tangents.length > 0) {
      this.tangentBuffer = this.createStaticBuffer(gl, this.tangents, 3, 4);
    } else {
      gl.disableVertexAttribArray(3);
    }

    this.facesBuffer = gl.createBuffer()!;
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.facesBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, this.faces, gl.STATIC_DRAW);

    gl.bindVertexArray(null);
  }

  private createStaticBuffer(
    gl: WebGL2RenderingContext,
    data: Float32Array,
    index: number,
    size: number,
  ): WebGLBuffer {
    const buffer = gl.createBuffer()!;
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
    gl.enableVertexAttribArray(index);
    gl.vertexAttribPointer(index, size, gl.FLOAT, false, 0, 0);
    return buffer;
  }

  public override destroyResource(): void {
    const gl = FacadeWebgl._gl;
    const buffers = [
      this.vertexBuffer,
      this.normalBuffer,
      this.uvBuffer,
      this.tangentBuffer,
      this.facesBuffer,
    ];

    buffers.forEach((buffer) => {
      if (buffer) gl.deleteBuffer(buffer);
    });

    if (this.vao) {
      gl.deleteVertexArray(this.vao);
    }
  }

  private concatToFloat32(chunks: number[][]): Float32Array {
    const totalSize = chunks.reduce((acc, chunk) => acc + chunk.length, 0);
    const result = new Float32Array(totalSize);
    let offset = 0;
    for (const chunk of chunks) {
      result.set(chunk, offset);
      offset += chunk.length;
    }
    return result;
  }

  private concatToUint32(chunks: number[][]): Uint32Array {
    const totalSize = chunks.reduce((acc, chunk) => acc + chunk.length, 0);
    const result = new Uint32Array(totalSize);
    let offset = 0;
    for (const chunk of chunks) {
      result.set(chunk, offset);
      offset += chunk.length;
    }
    return result;
  }

  public get bounds() {
    return this.meshBounds;
  }
}
