import { Trait, type TraitAttributes } from "./trait.js";
import { Rotation } from "../../../../values/rotation.js";
import { Vector } from "../../../../values/vector.js";
import { Transform } from "./transform.js";
import type { Actor } from "../actor.js";

interface CameraAttributes extends TraitAttributes {
    offset?: Vector
    rotation?: Rotation
    zoom?: number
}

export class Camera extends Trait {
    public offset: Vector
    public rotation: Rotation
    public zoom: number

    constructor(attributes: CameraAttributes) {
        super(attributes)
        this.offset = attributes.offset ?? new Vector({})
        this.rotation = attributes.rotation ?? new Rotation({})
        this.zoom = attributes.zoom ?? 1.0
    }

    public get raw() {
        const actor = this.parent as Actor;
        const transform = actor?.getFromTraits<Transform>("Transform");
        if (!transform) throw new Error("Camera needs a Transform");

        const pos = transform.worldPosition.add(this.offset);
        
        return {
            position: { x: pos.x, y: pos.y },
            zoom: this.zoom
        };
    }
}