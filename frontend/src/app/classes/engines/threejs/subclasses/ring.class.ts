import { Mesh, Scene, Group, Material, Object3D, Object3DEventMap } from "three";
import { Setting } from "./setting.class";
import { Box } from "./box.class";

export class Ring {
  private mesh: Mesh;
  private settings: Setting[] = [];
  private box?: Box;

  constructor(mesh: Mesh) {
    this.mesh = mesh;
  }

  public setSetting(setting: Setting, index: number) {
    this.settings[index] = setting;
  }

  public removeSetting(index: number, group: any) {
    const setting = this.settings[index];
    if (!setting) return;

    // Limpiar Gemas asociadas
    setting.getGemstones().forEach(g => {
        if (g) {
            const gemstoneMesh = g.getGemstoneMesh();
            group.remove(gemstoneMesh);
            if (gemstoneMesh.geometry) gemstoneMesh.geometry.dispose();
        }
    });

    // Limpiar el engaste (la garra/metal)
    const settingMesh = setting.getSettingMesh();
    group.remove(settingMesh);
    if (settingMesh.geometry) settingMesh.geometry.dispose();

    this.settings[index] = null as any; 
  }

  public setBaseStructure(mesh: Mesh) {
    this.mesh = mesh;
  }

  public setMaterial(material: Material) {
    this.mesh.material = material;
    // Filtrar los nulos para que no de error al cambiar de variante
    this.settings.forEach(s => {
        if (s) s.getSettingMesh().material = material;
    });
  }

  public getBaseStructureMesh() : Mesh {
    return this.mesh;
  }

  public getSetting(setting: number) : Setting {
    return this.settings[setting];
  }

  public setSettingPosition(setting: number, x: number, y: number, z: number) {
    this.settings[setting].setSettingPosition(x, y, z);
  }

  public setSettingRotation(setting: number, x: number, y: number, z: number, w: number) {
    this.settings[setting].setSettingRotation(x, y, z, w);
  }

  public setSettingScale(setting: number, scale: number) {
    this.settings[setting].setSettingScale(scale);
  }

    // poner caja, quitar caja, material interior y exterior...
  public setBox(box: Box) {
    this.box = box;
  }

  public getBox(): Box | undefined {
    return this.box;
  }

  public removeBox(scene: Scene, group: Group) {
    if (this.box) {
      const boxElement = this.box.getBoxElement();
      scene.remove(boxElement);
      group.remove(boxElement);
      
      // Limpieza de memoria para las primitivas de la caja
      boxElement.traverse((child: any) => {
        if (child.isMesh) {
          child.geometry.dispose();
          child.material.dispose();
        }
      });
      
      this.box = undefined;
    }
  }

  // Cambiar color interior
public setBoxInnerMaterial(material: Material) {
  if (this.box) {
    this.box.updateSpecificMaterial("interior", material);
  }
}

// Cambiar color exterior
public setBoxOuterMaterial(material: Material) {
  if (this.box) {
    this.box.updateSpecificMaterial("exterior", material);
  }
}


  public clearAllSettings( group: any) {
    // 1. Limpieza lógica (tu array)
    this.settings.forEach((_, index) => {
        this.removeSetting(index, group);
    });
    this.settings = [];

    // Limpieza física
    // Buscamos en el grupo de Three.js cualquier cosa que no sea la base del anillo
    // y la eliminamos, por si quedó algún 'zombi'
    const toRemove: Object3D[] = [];
    group.traverse((child: Object3D<Object3DEventMap>) => {
        // Si el objeto es una Mesh y no es la base del anillo (this.mesh)
        if (child instanceof Mesh && child !== this.mesh) {
            toRemove.push(child);
        }
    });

    toRemove.forEach(obj => {
        if (obj.parent) obj.parent.remove(obj);
        if ((obj as Mesh).geometry) (obj as Mesh).geometry.dispose();
    });
  }

}