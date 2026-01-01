import { Value, type ValueAttributes } from "./value.js"
import { Vector } from "./vector.js"
import { Dim } from "./dim.js"

import r from "@r1tsuu/raylib"

interface RectAttributes extends ValueAttributes {
    position?: Vector
    size?: Dim
}

export class Rect extends Value {
    position: Vector
    size: Dim

    constructor(attributes: RectAttributes) {
        super(attributes)
        this.position = attributes.position ?? new Vector({})
        this.size = attributes.size ?? new Dim({})
    }

    public get raw(): r.Rectangle {
        return {
            x: this.position.x,
            y: this.position.y,
            width: this.size.offset.x,
            height: this.size.offset.y
        } as r.Rectangle
    }

    public add(other: Rect): Rect {
        return new Rect({
            position: this.position.add(other.position) as Vector,
            size: this.size.add(other.size) as Dim
        })
    }

    public sub(other: Rect): Rect {
        return new Rect({
            position: this.position.sub(other.position) as Vector,
            size: this.size.sub(other.size) as Dim
        })
    }

    public mul(scaler: number): Rect {
        return new Rect({
            position: this.position.mul(scaler) as Vector,
            size: this.size.mul(scaler) as Dim
        })
    }

    public div(scaler: number): Rect {
        return new Rect({
            position: this.position.div(scaler) as Vector,
            size: this.size.div(scaler) as Dim
        })
    }

    public inv(): Rect {
        return new Rect({
            position: this.position.inv() as Vector,
            size: this.size.inv() as Dim
        })
    }

    public equal(other: Rect): boolean {
        return this.position.equal(other.position) && this.size.equal(other.size)
    }

    public clone(): Rect {
        return new Rect({
            position: this.position.clone() as Vector,
            size: this.size.clone() as Dim
        })
    }

    public toString(): string {
        return `Rect(Pos: ${this.position}, Size: ${this.size})`
    }
}