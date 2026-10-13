import { ElementRef, Injectable, Signal } from "@angular/core";
import { IFacade } from "../../interfaces/engine/IFacade.interface";
import { FacadeThreejs } from "../../classes/engines/threejs/interface-threejs.class";
import { Rotation } from "../../interfaces/engine/rotation.interface";
import { Position } from "../../interfaces/engine/position.interface";

@Injectable()
export class FacadeThreejsService implements IFacade {

    constructor(private facade: FacadeThreejs) { }

    // Scene management
    public async createScene(canvas: ElementRef<HTMLCanvasElement>): Promise<void> {
        this.facade.createScene(canvas); // Contenedor logico
        this.facade.createLoaders();
        // Suelo (para las sombras)
        this.facade.loadFloor(0.5, 0.5);

        // Camara
        this.facade.createCamera(canvas.nativeElement.clientWidth / canvas.nativeElement.clientHeight, true);
        this.facade.setCameraPosition(0.06, 0.06, -0.04);

        // Controles de camara
        this.facade.addControls();

        // Luz ambiental
        this.facade.createAmbientLight(0xffffff, .7);

        // Luz puntual
        this.facade.createPointLight(0xffffff, 1, 10, 2, 2, 2, 2);  // luz fuego
        this.facade.createPointLight(0xffffff, 1, 0, 2, 10, 10, 10);

        // Luz direccional
        this.facade.createDirectionalLight(0xffffff, 5, 10, 10, 10);
        this.facade.createDirectionalLight(0xffffff, 5, -10, 10, -10);
        this.facade.createDirectionalLight(0xffffff, 1, 0.1, 0.3, 0.4, 0, 0, 0);

        // Mapa de entorno
        this.facade.setEnvMap('/models/fondo-estudio');

        this.facade.prepareOutlineEffect();

        return Promise.resolve();
    }

    public destroyScene(): void {
        this.facade.stop();
    };

    public animate(): void {
        this.facade.animate();
    }

    // Cmabiar la rotación automática
    public toggleAutoRotation(value: boolean) {
        this.facade.toggleAutoRotation(value);
    }

    // Ring management

    // ----- Gemstones -----

    public async loadGemstone(path: string, materialName: string, settingIndex: number, index: number, position: Position, rotation: Rotation, scale: number): Promise<void> {
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
            scale
        )
    }

    public setGemstoneMaterial(materialName: string, settingIndex: number, gemstoneIndex: number): void {
        this.facade.setGemstoneMaterial(materialName, settingIndex, gemstoneIndex);
    }

    // ----- Setting -----

    public async loadSetting(path: string, materialName: string, index: number, position: Position, rotation: Rotation, scale: number): Promise<void> {
        await this.facade.loadSetting(
            path,
            materialName,
            index,
            position.x, position.y, position.z,
            rotation.x, rotation.y, rotation.z, rotation.w,
            scale
        )
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


    public async loadBaseStructure(path: string, materialName: string): Promise<void> {
        await this.facade.loadBaseStructure(path, materialName);
    }
    

    // ----- Boxes -----
    public async loadBox( path: string,  innerMaterialColor: string,  outerMaterialColor: string,  detailsMaterialColor: string) {
        await this.facade.loadBox(path, innerMaterialColor, outerMaterialColor, detailsMaterialColor);
    }

    public getScreenshot(): string {
      return this.facade.getOptimizedScreenshot(300); 
    }

    // ----- Animation -----
    public playSceneAnimation(): void {}

    public stopSceneAnimation(): void {}
}