import { Signal } from "./dispatch/other/signal";

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
    public update: Signal;
    public render: Signal;
   
    constructor(attributes: ModuleAttributes) {
        this.parent = attributes.parent;
        this.name = attributes.name ?? "Unknown";
        this.id = attributes.id ?? nanoid(8);
        this.enabled = false;
        this.update = new Signal({ name: "update" });
        this.render = new Signal({ name: "render" });
    }

    public start(): void { this.enabled = true; }
    public stop(): void { this.enabled = false; }
}