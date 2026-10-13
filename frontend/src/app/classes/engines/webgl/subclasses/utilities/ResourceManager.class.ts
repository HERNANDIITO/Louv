import { Resource } from "./Resource.class";
import { MeshResource } from "../resources/RMesh.class";
import { TextureResource } from "../resources/RTexture.class";
import { MaterialResource } from "../resources/RMaterial.class";
import { CubemapResource } from "../resources/RCubeMap.class";
import { ShaderResource } from "../resources/RShader.class";

export enum resourceType {
  "mesh",
  "texture",
  "material",
  "cubemap",
  "shader",
}

export class ResourceManager {
  private static instance: ResourceManager;

  private resources: Resource[] = [];

  public static getInstance() {
    // Si no existe la instancia, la creamos
    if (!ResourceManager.instance) {
      ResourceManager.instance = new ResourceManager();
    }

    // Devolvemos la instancia
    return ResourceManager.instance;
  }

  public getResource(name: string, type: resourceType): Resource {
    // Hasheamos el string para ver si ya se ha creado el resource
    const resource = this.resources.find(
      (resource: Resource) => resource.getName() === name,
    );

    // Si existe, lo devolvemos
    if (resource != undefined) return resource;

    // Le ponemos uno por defecto para que TS no llore
    let newResource: Resource = new CubemapResource(name);

    // Si no existe, lo cargamos
    switch (type) {
      case resourceType.cubemap:
        // Aqui se deberia crear el de antes pero es el valor por defecto
        break;
      case resourceType.mesh:
        newResource = new MeshResource(name);
        break;
      case resourceType.texture:
        newResource = new TextureResource(name);
        break;
      case resourceType.material:
        newResource = new MaterialResource(name);
        break;
      case resourceType.shader:
        newResource = new ShaderResource(name);
        break;
      default:
        newResource = new CubemapResource(name);
        break;
    }

    this.resources.push(newResource);

    switch (type) {
      case resourceType.cubemap:
        return newResource as CubemapResource;
      case resourceType.mesh:
        return newResource as MeshResource;
      case resourceType.texture:
        return newResource as TextureResource;
      case resourceType.material:
        return newResource as MaterialResource;
      case resourceType.shader:
        return newResource as ShaderResource;
      default:
        return newResource as CubemapResource;
    }
  }

  public deleteResource(file: string): boolean {
    // Hasheamos el string para ver si ya se ha creado el mesh
    const resource = this.resources.find(
      (resource: Resource) => resource.getName() === file,
    );

    if (!resource) return false;

    // Cogemos el tamaño del array
    const prevResources = this.resources.length;

    // Intentamos borrar el mesh indicado
    resource.destroyResource();
    this.resources = this.resources.filter(
      (resource) => resource.getName() !== file,
    );

    // Cogemos el tamaño del array despues de borrar
    const currentResources = this.resources.length;

    // Comprobamos si se hqa borrado algo
    // si se ha borrado, devolvemos true
    if (prevResources > currentResources) {
      return true;
    }

    // sino, false
    return false;
  }

  public deleteAllResources(): void {
    this.resources.forEach((resource) => {
      resource.destroyResource();
    });
    this.resources = [];
  }

  public logResources(): void {

    if (this.resources.length !== 0) {
      const resourceInfo = this.resources.map((res) => {
        let typeName = "Unknown";
        if (res instanceof MeshResource) typeName = "Mesh";
        else if (res instanceof TextureResource) typeName = "Texture";
        else if (res instanceof MaterialResource) typeName = "Material";
        else if (res instanceof ShaderResource) typeName = "Shader";
        else if (res instanceof CubemapResource) typeName = "Cubemap";

        return {
          Name: res.getName(),
          Type: typeName,
          Instance: res,
        };
      });

    }
  }
}
