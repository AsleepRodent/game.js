import type { Scene } from "./scene.js"
import type { Trait } from "./traits/trait.js"
import { nanoid } from "nanoid"

interface ActorAttributes {
    parent: Scene | Actor
    name?: string
    id?: string
}

export class Actor {
    public parent: Scene | Actor
    public name: string
    public id: string
    public cast: Actor[]
    public traits: Record<string, Trait>
    public enabled: boolean
    [key: string]: any;

    constructor(attributes: ActorAttributes) {
        this.parent = attributes.parent;
        this.name = attributes.name ?? "Actor";
        this.id = attributes.id ?? nanoid(8);
        this.cast = []
        this.traits = {}
        this.enabled = true
        
        if (this.parent && "addToCast" in this.parent) {
            (this.parent as any).addToCast(this);
        }

        return new Proxy(this, {
            get: (target, prop: string | symbol) => {
                if (prop in target) return (target as any)[prop];

                if (typeof prop === "string") {
                    const actor = target.getFromCast(prop);
                    if (actor) return actor;

                    const trait = target.getFromTraits(prop);
                    if (trait) return trait;
                }
                return undefined;
            }
        });
    }

    public getFromTraits<T extends Trait>(target: string): T | undefined {
        if (this.traits[target]) return this.traits[target] as T;
        for (const name in this.traits) {
            const trait = this.traits[name];
            if (trait && (trait.id === target || trait.name === target)) return trait as T;
        }
        return undefined;
    }

    public addToTraits(trait: Trait): void {
        const traitClass = trait.constructor;
        const exists = Object.values(this.traits).some(t => t?.constructor === traitClass);
        if (!exists) {
            trait.parent = this; 
            this.traits[trait.name] = trait;
        }
    }

    public removeFromTraits(target: Trait | string): void {
        const id = typeof target === "string" ? target : target.id;
        if (typeof target === "string" && this.traits[target]) {
            delete this.traits[target];
            return;
        }
        for (const name in this.traits) {
            const trait = this.traits[name];
            if (trait && (trait.id === id || trait.name === id)) {
                delete this.traits[name];
                break;
            }
        }
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
    
    public get game(): any {
        let current: any = this.parent;

        while (current) {
            if (current.scenes && current.parent) {
                return current.parent;
            }

            if (!current.parent) break;
            current = current.parent;
        }

        return undefined;
    }

    public update(dt: number): void {
        if (!this.enabled) return;
        for (const key in this.traits) this.traits[key]?.update(dt);
        for (const actor of this.cast) actor.update(dt);
    }

    public render(): void {
        if (!this.enabled) return;
        for (const key in this.traits) this.traits[key]?.render();
        for (const actor of this.cast) actor.render();
    }
}