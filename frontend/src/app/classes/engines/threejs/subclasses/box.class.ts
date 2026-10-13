import { Mesh, Quaternion, Material, Object3D, Group } from "three";

export class Box {
    // Tiene que ser un object3D para que threeJS detecte bien los 
    // materiales ya que tiene dos materiales en un mismo mesh  
    private container: Object3D;

    constructor(container: Object3D) {
      this.container = container;
      this.initUserData();
    }

    // Con este método marcamos las mesh y le ponemos a cada una 
    // si es interior o exterior para luego poder cambiarles los 
    // materiales individualmente
  private initUserData() {
    this.container.traverse((child: any) => {
      if (child.isMesh) {
        const matName = child.material.name.toLowerCase();
        if (matName.includes("interior")) {
          //usamos userData, una propiedad de los object3D para guardar información sobre los mesh
          child.userData.role = "interior"; 
        } else if (matName.includes("exterior")) {
          child.userData.role = "exterior";
        } else {
          child.userData.role = "details";
        }
      }
    });
  }

    public getBoxElement(): Object3D {
      return this.container;
    }

    public setPosition(x: number, y: number, z: number) {
      this.container.position.set(x, y, z);
    }

    public setScale(scale: number) {
      this.container.scale.set(scale, scale, scale);
    }

    // La función para asignar los materiales no sé si está correcta aquí (tengo que preguntar)
    public setMaterials(innerMat: Material, outerMat: Material, detailsMat: Material) {
    this.container.traverse((child: any) => {
      if (child.isMesh) {
        // Recalculamos normales por si el exportador hizo algo raro, 
        // esto ayuda a que el sombreado sea suave. (No se utiliza pero lo he dejado por si acaso)
        //child.geometry.computeVertexNormals();
        const role = child.userData.role;
        
        if (role === "interior" ) {
          child.material = innerMat;
        } else if (role === "exterior") {
          child.material = outerMat;
        } else {
          child.material = detailsMat;
        }
      }
    });
  }

  // Esta función es para actualizar solo un material (tampoco sé si es correcta aquí)
  public updateSpecificMaterial(target: "interior" | "exterior", newMaterial: Material) {
    this.container.traverse((child: any) => {
      if (child.isMesh && child.userData.role === target) {
        child.material = newMaterial;
      }
    });
  }

}
