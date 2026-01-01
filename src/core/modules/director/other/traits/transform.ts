import { Trait, type TraitAttributes } from "./trait.js";
import { Vector } from "../../../../values/vector.js";
import { Rotation } from "../../../../values/rotation.js";
import { Dim } from "../../../../values/dim.js";
import { Actor } from "../actor.js";
import { Frame } from "./frame.js";

interface TransformAttributes extends TraitAttributes {
    position?: Vector | Dim;
    size?: Vector | Dim;
    rotation?: Rotation;
}

export class Transform extends Trait {
    public position: Vector | Dim;
    public size: Vector | Dim;
    public rotation: Rotation;

    constructor(attributes: TransformAttributes) {
        super(attributes);
        this.position = attributes.position ?? new Vector({});
        this.size = attributes.size ?? new Vector({ x: 1, y: 1, z: 1 });
        this.rotation = attributes.rotation ?? new Rotation({});
    }

    public get worldPosition(): Vector {
        const actor = this.parent as Actor;
        let localPos: Vector;

        if (this.position instanceof Dim) {
            if (actor.parent instanceof Actor) {
                const parentTransform = actor.parent.getFromTraits<Transform>("Transform");
                if (parentTransform) {
                    const parentSize = parentTransform.worldSize;
                    
                    const parentFrame = actor.parent.getFromTraits<Frame>("Frame");
                    const parentAnchor = parentFrame?.anchor ?? new Vector({ x: 0.5, y: 0.5 });

                    const parentOrigin = new Vector({
                        x: -parentSize.x * parentAnchor.x,
                        y: -parentSize.y * parentAnchor.y,
                        z: 0
                    });

                    localPos = new Vector({
                        x: parentOrigin.x + (parentSize.x * this.position.scale.x) + this.position.offset.x,
                        y: parentOrigin.y + (parentSize.y * this.position.scale.y) + this.position.offset.y,
                        z: (parentSize.z * this.position.scale.z) + this.position.offset.z
                    });
                } else {
                    localPos = this.position.offset.clone();
                }
            } else {
                localPos = this.position.offset.clone();
            }
        } else {
            localPos = this.position.clone();
        }

        if (actor.parent instanceof Actor) {
            const parentTransform = actor.parent.getFromTraits<Transform>("Transform");
            if (parentTransform) {
                const pRot = parentTransform.worldRotation.z * (Math.PI / 180);
                const rotatedX = localPos.x * Math.cos(pRot) - localPos.y * Math.sin(pRot);
                const rotatedY = localPos.x * Math.sin(pRot) + localPos.y * Math.cos(pRot);

                const pPos = parentTransform.worldPosition;
                return new Vector({
                    x: pPos.x + rotatedX,
                    y: pPos.y + rotatedY,
                    z: pPos.z + localPos.z
                });
            }
        }
        return localPos;
    }

    public get worldSize(): Vector {
        const actor = this.parent as Actor;
        
        if (this.size instanceof Dim) {
            if (actor.parent instanceof Actor) {
                const parentTransform = actor.parent.getFromTraits<Transform>("Transform");
                if (parentTransform) {
                    const parentSize = parentTransform.worldSize;
                    return new Vector({
                        x: (parentSize.x * this.size.scale.x) + this.size.offset.x,
                        y: (parentSize.y * this.size.scale.y) + this.size.offset.y,
                        z: (parentSize.z * this.size.scale.z) + this.size.offset.z
                    });
                } else {
                    return this.size.offset.clone();
                }
            } else {
                return this.size.offset.clone();
            }
        } else {
            return this.size.clone();
        }
    }

    public get worldRotation(): Rotation {
        const actor = this.parent as Actor;
        if (actor.parent instanceof Actor) {
            const parentTransform = actor.parent.getFromTraits<Transform>("Transform");
            if (parentTransform) {
                return parentTransform.worldRotation.add(this.rotation);
            }
        }
        return new Rotation({ x: this.rotation.x, y: this.rotation.y, z: this.rotation.z });
    }
}