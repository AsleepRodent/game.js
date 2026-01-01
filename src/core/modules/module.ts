import { nanoid } from "nanoid"

export interface ModuleAttributes {
    parent: any;
    name?: string;
    id?: string;
}

export abstract class Module {
    public parent: any;
    public name: string;
    public id: string;
    public enabled: boolean;
   

    constructor(attributes: ModuleAttributes) {
        this.parent = attributes.parent;
        this.name = attributes.name ?? "Unknown";
        this.id = attributes.id ?? nanoid(8);
        this.enabled = false;
    }

    public start(): void {this.enabled = true}
    public stop(): void {this.enabled = false}

    public update(dt: number): void {}
    public render(): void {}

}