import { ElementRef, Signal } from "@angular/core";
import { Position } from "./position.interface";
import { Rotation } from "./rotation.interface";

export interface IFacade {
    
    // Atributos
    
    // Gestion de escena
    
    createScene(canvas: ElementRef<HTMLCanvasElement>): Promise<void>;
    destroyScene(): void;
    animate(): void;
    toggleAutoRotation(autorotate: boolean): void;
    
    // Modificacion de anillos

    // ----- Gemstones -----

    loadGemstone(
        path: string,            
        materialName: string, 
        settingIndex: number,
        index: number,
        position: Position,
        rotation: Rotation,
        scale: number,  
    ): Promise<void>;

    setGemstoneMaterial(materialName: string, settingIndex: number, gemstoneIndex: number): void;
    
    // ----- Settings -----

    loadSetting(
        path: string,
        materialName: string,
        index: number,
        position: Position,
        rotation: Rotation,
        scale: number
    ): Promise<void>;

    removeSetting(settingIndex: number): void;
    removeAllSettings(): void;
    
    // ----- Base Structures -----

    setStructureMaterial(materialName: string): void;

    loadBaseStructure(path: string, materialName: string): Promise<void>;

    // ----- Settings -----

    loadBox( path: string, innerMaterialColor: string, outerMaterialColor: string, detailsMaterialColor: string): Promise<void>;
    
    getScreenshot(): string;

    // ----- Animation -----
    playSceneAnimation(): void;
    stopSceneAnimation(): void;
}