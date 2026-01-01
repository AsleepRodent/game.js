import type { Renderer } from "../renderer.js"
import type { Transform } from "../../director/other/traits/transform.js"
import { Dim } from "../../../values/dim.js"
import { Vector } from "../../../values/vector.js"
import { Rotation } from "../../../values/rotation.js" 
import { Actor } from "../../director/other/actor.js"

export enum RenderSpace { World = 0, Screen = 1 }

interface RenderAttributes {
    parent: Renderer,
    space: RenderSpace
    transform: Transform
    position: Vector | Dim
    size: Vector | Dim
    rotation: Rotation
    anchor: Vector
}

export class Render {
    public parent: Renderer
    public space: RenderSpace
    public transform: Transform
    public position: Vector | Dim
    public size: Vector | Dim
    public rotation: Rotation
    public anchor: Vector
    private _onRender: (data: any) => void

    constructor(attributes: RenderAttributes, onRender: (data: any) => void) {
        this.parent = attributes.parent
        this.space = attributes.space
        this.transform = attributes.transform
        this.position = attributes.position
        this.size = attributes.size
        this.rotation = attributes.rotation
        this.anchor = attributes.anchor
        this._onRender = onRender
    }

    private resolve(value: Vector | Dim, parentSize: Vector): Vector {
        if (value instanceof Vector) return value;
        return new Vector({
            x: (parentSize.x * value.scale.x) + value.offset.x,
            y: (parentSize.y * value.scale.y) + value.offset.y,
            z: (parentSize.z * value.scale.z) + value.offset.z
        });
    }

    public getFinal() {
        const worldPos = this.transform.worldPosition;
        const worldSize = this.transform.worldSize;
        const worldRot = this.transform.worldRotation;

        const localSize = this.resolve(this.size, worldSize);

        const localOffset = this.resolve(this.position, worldSize);

        return {
            position: new Vector({
                x: worldPos.x + localOffset.x,
                y: worldPos.y + localOffset.y,
                z: worldPos.z + localOffset.z
            }),
            rotation: worldRot, 
            size: localSize,
            anchor: new Vector({
                x: localSize.x * this.anchor.x,
                y: localSize.y * this.anchor.y
            }),
            space: this.space,
            depth: worldPos.z + localOffset.z
        };
    }

    public refresh(position: Vector | Dim, size: Vector | Dim, rotation: Rotation, anchor: Vector): void {
        this.position = position;
        this.size = size;
        this.rotation = rotation;
        this.anchor = anchor;
    }

    public execute(data: any): void {
        this._onRender(data);
    }
}