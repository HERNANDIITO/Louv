import { Mesh, Quaternion, Material } from "three";

export class Gemstone {
  private mesh: Mesh;

  constructor(mesh: Mesh) {
    this.mesh = mesh;
  }

  public setMaterial(material: Material) {
    this.mesh.material = material;
  }

  public setCut(mesh: Mesh) {
    this.mesh = mesh;
  }

  // public setPosition(x: number, y: number, z: number) {
  //   this.mesh.position.set(x, y, z);
  // }

  // public setScale(scale: number, ownScale: number = this.ownScale) {
  //   this.mesh.scale.set(scale, scale, scale);
  //   this.ownScale = ownScale;
  // }

  // public setRotation(ownRotation: Quaternion, x: number, y: number, z: number, w: number) {
  //   this.mesh.quaternion.set(x, y, z, w);
  //   this.ownRotation = ownRotation;
  // }

  public getGemstoneMesh() : Mesh {
    return this.mesh;
  }

  public addPosition(x: number, y: number, z: number) {
    this.mesh.position.x += x;
    this.mesh.position.y += y;
    this.mesh.position.z += z;
  }

  public multiplyPosition(scale: number) {
    this.mesh.position.x *= scale;
    this.mesh.position.y *= scale;
    this.mesh.position.z *= scale;
  }

  public dividePosition(scale: number) {
    this.mesh.position.x /= scale;
    this.mesh.position.y /= scale;
    this.mesh.position.z /= scale;
  }

  // public addRotation(x: number, y: number, z: number, w: number) {
  //   const newRotation = new Quaternion(x, y, z, w).multiply(this.ownRotation).normalize();
  //   this.mesh.quaternion.set(newRotation.x, newRotation.y, newRotation.z, newRotation.w);
  // }

  // public setNewScale(oldScale: number, newScale: number, settingX: number, settingY: number, settingZ: number) {
  //   this.addPosition(-settingX, -settingY, -settingZ);
  //   this.dividePosition(oldScale);
  //   this.setScale(newScale);
  //   this.multiplyPosition(newScale);
  //   this.addPosition(settingX, settingY, settingZ);
  // }
}