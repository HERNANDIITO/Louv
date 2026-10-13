import { ElementRef, Injectable } from "@angular/core";
import { IFacade } from "../../interfaces/engine/IFacade.interface";
import { Position } from "../../interfaces/engine/position.interface";
import { Rotation } from "../../interfaces/engine/rotation.interface";
import { FacadeWebgl } from "../../classes/engines/webgl/interface-webgl.class";
import { CameraEntity } from "../../classes/engines/webgl/subclasses/entities/ECamera.class";

@Injectable({
  providedIn: "root",
})
export class FacadeWebGLService implements IFacade {
  constructor(private facade: FacadeWebgl) {}

  // Scene management

  // facade-webgl.service.ts

  public async createScene(
    canvas: ElementRef<HTMLCanvasElement>,
  ): Promise<void> {
    await this.facade.init(canvas);

    const ambientNode = this.facade.newNode(this.facade.rootNode);
    this.facade.createAmbientLight(ambientNode, 0xffffff, 1.0);

    const pointNode1 = this.facade.newNode(this.facade.rootNode);
    pointNode1.setTranslation(2, 2, -2);  
    this.facade.createPointLight(pointNode1, 0xffffff, 1, 10, 2);

    const pointNode2 = this.facade.newNode(this.facade.rootNode);
    pointNode2.setTranslation(10, 10, 10);
    this.facade.createPointLight(pointNode2, 0xffffff, 1, 0, 2);

    const dirNode1 = this.facade.newNode(this.facade.rootNode);
    dirNode1.setTranslation(10, 10, 10);
    this.facade.createDirectionalLight(dirNode1, 0xffffff, 5);

    const dirNode2 = this.facade.newNode(this.facade.rootNode);
    dirNode2.setTranslation(10, -10, 10);
    this.facade.createDirectionalLight(dirNode2, 0xffffff, 5);

    const dirNode3 = this.facade.newNode(this.facade.rootNode);
    dirNode3.setTranslation(0.1, 0.3, 0.4);
    this.facade.createDirectionalLight(dirNode3, 0xffffff, 1);
    this.facade.setShadowLight(pointNode1);

    await this.facade.setEnvMap("/models/fondo-estudio");

    const cameraNode = this.facade.newNode(this.facade.rootNode);
    cameraNode.setTranslation(0.06, 0.06, -0.04);
    cameraNode.lookAt(0, 0, 0);

    const cameraEntity = new CameraEntity(
      this.facade.canvas.width / this.facade.canvas.height,
      true,
    );
    cameraNode.entity = cameraEntity;
    this.facade.setCamera(cameraNode);
    this.facade.setOrbitMode("object");
  }

  public destroyScene(): void {
    this.facade.cleanup();
  }

  public animate(): void {
    try {
      this.facade.update();
      this.facade.render();

      // Capturamos el ID del nuevo frame
      const id = requestAnimationFrame(() => this.animate());

      // Se lo pasamos a la fachada para que ella sepa qué cancelar
      this.facade.setAnimationFrameId(id);
    } catch (error) {}
  }

  public toggleAutoRotation(autorotate: boolean): void {
    // delegate to facade; it rotará la cámara u objeto según el modo actual
    this.facade.toggleAutoRotation(autorotate);
  }

  // Ring management

  // ----- Gemstones -----

  public async loadGemstone(
    path: string,
    materialName: string,
    settingIndex: number,
    index: number,
    position: Position,
    rotation: Rotation,
    scale: number,
  ): Promise<void> {
    await this.facade.loadGemstone(
      path,
      materialName,
      settingIndex,
      index,
      position.x,
      position.y,
      position.z,
      rotation.x,
      rotation.y,
      rotation.z,
      rotation.w,
      scale,
    );
  }

  public setGemstoneMaterial(
    materialName: string,
    settingIndex: number,
    gemstoneIndex: number,
  ): void {
    this.facade.setGemstoneMaterial(materialName, settingIndex, gemstoneIndex);
  }

  // ----- Setting -----

  public async loadSetting(
    path: string,
    materialName: string,
    index: number,
    position: Position,
    rotation: Rotation,
    scale: number,
  ): Promise<void> {
    await this.facade.loadSetting(
      path,
      materialName,
      index,
      position.x,
      position.y,
      position.z,
      rotation.x,
      rotation.y,
      rotation.z,
      rotation.w,
      scale,
    );
  }

  public removeSetting(settingIndex: number): void {
    this.facade.removeSetting(settingIndex);
  }

  public removeAllSettings(): void {
    this.facade.removeAllSettings();
  }

  // ----- Base structure -----
  public setStructureMaterial(materialName: string): void {
    this.facade.setStructureMaterial(materialName);
  }

  public async loadBaseStructure(
    path: string,
    materialName: string,
  ): Promise<void> {
    await this.facade.loadBaseStructure(path, materialName);
  }

  // ----- Boxes -----
  public async loadBox(
    path: string,
    innerMaterialColor: string,
    outerMaterialColor: string,
    detailsMaterialColor: string,
  ): Promise<void> {}

    // ----- Captura -----
    public getScreenshot(): string {
      return this.facade.getOptimizedScreenshot(300); 
    }

    // ----- Animación -----
    public playSceneAnimation(): void {
      this.facade.playSceneAnimation();
    }

    public stopSceneAnimation(): void {
      this.facade.stopSceneAnimation();
    }
}
