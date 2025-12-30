import type { Actor } from "../actor.js"
import type { Scene } from "../scene.js"

import { nanoid } from "nanoid"

interface TraitAttributes {
    parent: Actor | Scene,
    name?: string,
    id?: string
}

export class Trait {
    parent: Actor | Scene
    name: string
    id: string
    enabled: boolean

    constructor(attributes: TraitAttributes) {
        this.parent = attributes.parent
        this.name = attributes.name ?? this.constructor.name
        this.id = attributes.id ?? nanoid(8)
        this.enabled = true
    }

    public update(dt: number): void {}
    public render(): void {}
}