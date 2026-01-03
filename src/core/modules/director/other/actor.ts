import type { Scene } from "./scene.js"
import type { Trait } from "./traits/trait.js"
import { Signal } from "../../dispatch/other/signal.js"
import { Hook } from "../../dispatch/other/hook.js"
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
    public cast: Actor[] = []
    public traits: Record<string, Trait> = {}
    public enabled: boolean = true
    
    public observer: any
    public onChanged!: Signal
    public onCastAdded = new Signal({})
    public onCastRemoved = new Signal({})
    public onTraitAdded = new Signal({})
    public onTraitRemoved = new Signal({})
    public update = new Signal({})
    public render = new Signal({})

    constructor(attributes: ActorAttributes) {
        this.parent = attributes.parent;
        this.name = attributes.name ?? "Actor";
        this.id = attributes.id ?? nanoid(8);

        if (this.parent && "addToCast" in this.parent) {
            (this.parent as any).addToCast(this);
        }

        this.update.connect((dt: number) => {
            if (!this.enabled) return;
            for (const key in this.traits) this.traits[key]?.update(dt);
            for (const actor of this.cast) actor.update.fire(dt);
        });

        this.render.connect(() => {
            if (!this.enabled) return;
            for (const key in this.traits) this.traits[key]?.render();
            for (const actor of this.cast) actor.render.fire();
        });

        return Hook.create({ 
            target: this,
            search: (key: string) => this.getFromCast(key) ?? this.getFromTraits(key)
        }) as Actor;
    }

    public getFromTraits<T extends Trait>(target: string): T | undefined {
        if (this.traits[target]) return this.traits[target] as T;
        return Object.values(this.traits).find(t => t.id === target || t.name === target) as T;
    }

    public addToTraits(trait: Trait): void {
        if (!Object.values(this.traits).some(t => t.constructor === trait.constructor)) {
            trait.parent = this; 
            this.traits[trait.name] = trait;
            this.onTraitAdded.fire(trait);
        }
    }

    public removeFromTraits(target: Trait | string): void {
        const id = typeof target === "string" ? target : target.id;
        const entry = Object.entries(this.traits).find(([_, t]) => t.id === id || t.name === id);
        if (entry) {
            const [key, trait] = entry;
            delete this.traits[key];
            this.onTraitRemoved.fire(trait);
        }
    }

    public getFromCast(target: Actor | string): Actor | undefined {
        const id = typeof target === "string" ? target : target.id;
        return this.cast.find(a => a.id === id || a.name === id);
    }

    public addToCast(target: Actor): void {
        if (!this.cast.some(a => a.id === target.id)) {
            target.parent = this;
            this.cast.push(target);
            this.onCastAdded.fire(target);
        }
    }

    public removeFromCast(target: Actor | string): void {
        const id = typeof target === "string" ? target : target.id;
        const index = this.cast.findIndex(a => a.id === id || a.name === id);
        if (index !== -1) {
            const [removed] = this.cast.splice(index, 1);
            this.onCastRemoved.fire(removed);
        }
    }
    
    public get game(): any {
        let current: any = this.parent;
        while (current) {
            if (current.scenes && current.parent) return current.parent;
            current = current.parent;
        }
        return undefined;
    }
}