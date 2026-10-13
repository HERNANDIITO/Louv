export abstract class Resource {

    protected name: string;

    public constructor(name: string) {
        this.name = name;
    }

    public abstract loadResource(name: string): Promise<boolean>;

    public abstract destroyResource(): void;

    public getName(): string {
        return this.name;
    }

    public setName(name: string): void {
        this.name = name;
    }
}