import { mat4 } from "gl-matrix";
import { RenderContext } from "../utilities/RenderContext.class";

export abstract class IEntity {
    constructor() {}

    public abstract render(mat: mat4, context: RenderContext): void;
    public abstract destroy(): void;

    public abstract update(deltaTime: number, node: any): void ;

}