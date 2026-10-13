import { Mesh, Quaternion, Vector3 } from "three";
import { Gemstone } from "./gemstone.class";

export class Setting {
  private mesh: Mesh;
  private gemstones: Gemstone[] = [];

  constructor(mesh: Mesh) {
    this.mesh = mesh;
  }

  public setSetting(mesh: Mesh) {
    this.mesh = mesh;
  }

  public setGemstone(gemstone: Gemstone, index: number) {
    this.gemstones[index] = gemstone;
  }

  public removeGemstone(gemstone: Gemstone, index: number) {
    this.gemstones.splice(index, 1);
  }

  public setPosition(x: number, y: number, z: number) {
    this.mesh.position.set(x, y, z);
  }
  
  public setScale(scale: number) {
    this.mesh.scale.set(scale, scale, scale);
  }

  public setRotation(x: number, y: number, z: number, w: number) {
    this.mesh.quaternion.set(x, y, z, w);
  }

  public getSettingMesh() : Mesh {
    return this.mesh;
  }

  public getPosition() : Vector3 {
    return new Vector3().setFromMatrixPosition(this.mesh.matrixWorld);
  }

  public getRotation(): Quaternion {
    return new Quaternion().setFromRotationMatrix(this.mesh.matrixWorld);
  }

  public getScale(): Vector3 {
    return new Vector3().setFromMatrixScale(this.mesh.matrixWorld);
  }

  public getGemstone(index: number): Gemstone {
    return this.gemstones[index];
  }

  public getGemstones(): Gemstone[] {
    return this.gemstones;
  }

  public setSettingPosition(x: number, y: number, z: number) {
    // Restamos la y actual a la gema ya que la formula para calcular la posicion de la gema es: posYEngaste + escalaEngaste * factorAjusteGema como la escala no cambia simplemente restamos la posición ya que este valor va a cambiar, con lo que nos quedamos con escalaEngaste * factorAjusteGema
    for (const gemstone of this.gemstones) {
      gemstone?.addPosition(-this.mesh.position.x, -this.mesh.position.y, -this.mesh.position.z);
    }
    this.setPosition(x, y, z);
    // Sumamos la nueva y a la gema para tener de nuevo posYEngaste + escalaEngaste * factorAjusteGema
    for (const gemstone of this.gemstones) {
      gemstone?.addPosition(x, y, z);
    }
  }

  public setSettingRotation(x: number, y: number, z: number, w: number) {
    //this.gemstones[0]?.addRotation(-this.mesh.quaternion.x, -this.mesh.quaternion.y, -this.mesh.quaternion.z, this.mesh.quaternion.w); // Al igual que ene setSettingPosition, restamos la rotación heredada antigua
    this.mesh.quaternion.set(x, y, z, w);
    // for (const gemstone of this.gemstones) {
    //   gemstone?.addRotation(x, y, z, w);
    // }
    //this.gemstones[0]?.addRotation(x, y, z, w); // Y posteriormente le sumamos la nueva rotación heredada de engaste, con esto logramos no perder la propia de la gema sin necesidad de almacenarla
  }

  public setSettingScale(scale: number) {
    // let oldScale = this.mesh.scale.x;
    this.setScale(scale);
    // for (const gemstone of this.gemstones) {
    //   gemstone?.setNewScale(oldScale, scale, this.mesh.position.x, this.mesh.position.y, this.mesh.position.z);
    // }
  }
}