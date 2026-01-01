import { Value } from "./value.js"
import { Vector } from "./vector.js"

interface DimAttributes {
    scale?: Vector
    offset?: Vector
}

export class Dim extends Value {
    scale: Vector
    offset: Vector

    constructor(attributes: DimAttributes) {
        super(attributes)
        this.scale = attributes.scale ?? new Vector({})
        this.offset = attributes.offset ?? new Vector({})
    }

    public get raw() {
        return {
            scale: this.scale.raw3D,
            offset: this.offset.raw3D
        }
    }

    public add(other: Dim): Dim {
        return new Dim({
            scale: this.scale.add(other.scale) as Vector,
            offset: this.offset.add(other.offset) as Vector
        })
    }

    public sub(other: Dim): Dim {
        return new Dim({
            scale: this.scale.sub(other.scale) as Vector,
            offset: this.offset.sub(other.offset) as Vector
        })
    }

    public mul(scaler: number): Dim {
        return new Dim({
            scale: this.scale.mul(scaler) as Vector,
            offset: this.offset.mul(scaler) as Vector
        })
    }

    public div(scaler: number): Dim {
        return new Dim({
            scale: this.scale.div(scaler) as Vector,
            offset: this.offset.div(scaler) as Vector
        })
    }

    public inv(): Dim {
        return new Dim({
            scale: this.scale.inv() as Vector,
            offset: this.offset.inv() as Vector
        })
    }

    public equal(other: Dim): boolean {
        return this.scale.equal(other.scale) && this.offset.equal(other.offset)
    }

    public clone(): Dim {
        return new Dim({
            scale: this.scale.clone() as Vector,
            offset: this.offset.clone() as Vector
        })
    }

    public toString(): string {
        return `Dim(Scale: ${this.scale}, Offset: ${this.offset})`
    }
}