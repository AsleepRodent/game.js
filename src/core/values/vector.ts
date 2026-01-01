import { Value, type ValueAttributes } from "./value.js";
import r from "@r1tsuu/raylib"

interface VectorAttributes extends ValueAttributes {
    x?: number,
    y?: number
    z?: number
}

export class Vector extends Value {
    x: number
    y: number
    z: number

    constructor(attributes: VectorAttributes) {
        super(attributes)
        this.x = attributes.x ?? 0
        this.y = attributes.y ?? 0
        this.z = attributes.z ?? 0
    }

    public get raw2D(): r.Vector2 {
        return {
            x: this.x,
            y: this.y
        } as r.Vector2
    }

    public get raw3D(): r.Vector3 {
        return {
            x: this.x,
            y: this.y,
            z: this.z
        } as r.Vector3
    }

    public add(other: Vector): Vector {
        return new Vector({
            x: this.x + other.x,
            y: this.y + other.y,
            z: this.z + other.z
        })
    }

    public sub(other: Vector): Vector {
        return new Vector({
            x: this.x - other.x,
            y: this.y - other.y,
            z: this.z - other.z
        })
    }

    public mul(scaler: number): Vector {
        return new Vector({
            x: this.x * scaler,
            y: this.y * scaler,
            z: this.z * scaler
        })
    }

    public div(scaler: number): Vector {
        return new Vector({
            x: this.x / scaler,
            y: this.y / scaler,
            z: this.z / scaler
        })
    }

    public inv(): Vector {
        return new Vector({ x: -this.x, y: -this.y, z: -this.z })
    }

    public equal(other: Vector): boolean {
        return this.x === other.x && this.y === other.y && this.z === other.z
    }

    public clone(): Vector {
        return new Vector({ x: this.x, y: this.y, z: this.z })
    }

    public toString(): string {
        return `Vector(${this.x}, ${this.y}, ${this.z})`
    }
}