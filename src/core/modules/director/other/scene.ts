import type { Actor } from "./actor.js"
import type { Camera } from "./traits/camera.js"
import { Director } from "../director.js"

export interface SceneAttributes {
    parent: Director
    name?: string
    index?: number
}

export class Scene {
    public parent: Director
    public name: string
    public index: number
    public cast: Actor[]
    public camera: Camera | null
    public enabled: boolean
    [key: string]: any;

    constructor(attributes: SceneAttributes) {
        this.parent = attributes.parent;
        this.name = attributes.name ?? "Unknown";
        this.index = attributes.index ?? 0;
        this.camera = null
        this.cast = []
        this.enabled = false

        if (this.parent && "addToScenes" in this.parent) {
            (this.parent as any).addToScenes(this);
        }

        return new Proxy(this, {
            get: (target, prop: string | symbol) => {
                if (prop in target) return (target as any)[prop];
                if (typeof prop === "string") return target.getFromCast(prop);
                return undefined;
            }
        });
    }

    public getFromCast(target: Actor | string): Actor | undefined {
        const id = typeof target === "string" ? target : target.id;
        return this.cast.find(actor => actor.id === id || actor.name === id);
    }

    public addToCast(target: Actor): void {
        const exists = this.cast.some(actor => actor.id === target.id);
        if (!exists) {
            target.parent = this;
            this.cast.push(target);
        }
    }

    public removeFromCast(target: Actor | string): void {
        const id = typeof target === "string" ? target : target.id;
        const index = this.cast.findIndex(actor => actor.id === id || actor.name === id);
        if (index !== -1) this.cast.splice(index, 1);
    }

    public update(dt: number): void {
        if (!this.enabled) return;
        for (const actor of this.cast) actor.update(dt);
    }

    public render(): void {
        if (!this.enabled) return;
        for (const actor of this.cast) actor.render();
    }
}