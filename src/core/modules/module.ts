export interface ModuleAttributes {
    parent: any;
    name?: string;
}

export class Module {
    public parent: any
    public name: string
    public enabled: boolean;

    constructor(attributes: ModuleAttributes) {
        this.parent = attributes.parent ?? null;
        this.name = attributes.name ?? "Unknown";
        this.enabled = false;
    }

    public start(): void {this.enabled = true}
    public stop(): void {this.enabled = false}
    public update(dt: number): void {}
    public render(): void {}

}