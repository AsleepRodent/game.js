import { Value, type ValueAttributes } from "./value.js";
import r from "@r1tsuu/raylib"

interface RotationAttributes extends ValueAttributes {
    x?: number,
    y?: number,
    z?: number
}

export class Rotation extends Value {
    x: number
    y: number
    z: number

    constructor(attributes: RotationAttributes) {
        super(attributes)
        this.x = attributes.x ?? 0
        this.y = attributes.y ?? 0
        this.z = attributes.z ?? 0
    }

    public get raw2D(): number {
        return this.z
    }

    public get raw3D(): r.Vector3 {
        return r.Vector3(this.x, this.y, this.z)
    }

    public add(other: Rotation): Rotation {
        return new Rotation({
            x: (this.x + other.x) % 360,
            y: (this.y + other.y) % 360,
            z: (this.z + other.z) % 360
        })
    }

    public sub(other: Rotation): Rotation {
        return new Rotation({
            x: (this.x - other.x) % 360,
            y: (this.y - other.y) % 360,
            z: (this.z - other.z) % 360
        })
    }

    public mul(scaler: number): Rotation {
        return new Rotation({
            x: this.x * scaler,
            y: this.y * scaler,
            z: this.z * scaler
        })
    }

    public div(scaler: number): Rotation {
        return new Rotation({
            x: this.x / scaler,
            y: this.y / scaler,
            z: this.z / scaler
        })
    }

    public inv(): Rotation {
        return new Rotation({ x: -this.x, y: -this.y, z: -this.z })
    }

    public equal(other: Rotation): boolean {
        return (this.x % 360) === (other.x % 360) &&
               (this.y % 360) === (other.y % 360) &&
               (this.z % 360) === (other.z % 360)
    }

    public clone(): Rotation {
        return new Rotation({ x: this.x, y: this.y, z: this.z })
    }

    public toString(): string {
        return `Rotation(${this.x}º, ${this.y}º, ${this.z}º)`
    }
}