import type { Actor } from "../actor.js"
import type { Scene } from "../scene.js"
import { nanoid } from "nanoid"

export interface TraitAttributes {
    parent: Actor | Scene,
    name?: string,
    id?: string
}

export abstract class Trait {
    parent: Actor | Scene
    name: string
    id: string
    enabled: boolean

    constructor(attributes: TraitAttributes) {
        this.parent = attributes.parent
        this.name = attributes.name ?? this.constructor.name
        this.id = attributes.id ?? nanoid(8)
        this.enabled = true

        if (this.parent && "addToTraits" in this.parent) {
            (this.parent as any).addToTraits(this);
        }
    }

    public update(dt: number): void {}
    public render(): void {}
}