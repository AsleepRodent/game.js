import { Value, type ValueAttributes } from "./value.js"

interface RangeAttributes extends ValueAttributes {
    min?: number
    max?: number
}

export class Range extends Value {
    min: number
    max: number

    constructor(attributes: RangeAttributes) {
        super(attributes)
        this.min = attributes.min ?? 0
        this.max = attributes.max ?? 1
    }

    public get raw(): { min: number, max: number } {
        return { min: this.min, max: this.max }
    }

    public get random(): number {
        return Math.random() * (this.max - this.min) + this.min
    }

    public get center(): number {
        return (this.min + this.max) / 2
    }

    public contains(value: number): boolean {
        return value >= this.min && value <= this.max
    }

    public add(other: Range): Range {
        return new Range({
            min: this.min + other.min,
            max: this.max + other.max
        })
    }

    public sub(other: Range): Range {
        return new Range({
            min: this.min - other.min,
            max: this.max - other.max
        })
    }

    public mul(scaler: number): Range {
        return new Range({
            min: this.min * scaler,
            max: this.max * scaler
        })
    }

    public div(scaler: number): Range {
        return new Range({
            min: this.min / scaler,
            max: this.max / scaler
        })
    }

    public inv(): Range {
        return new Range({ min: this.max, max: this.min })
    }

    public equal(other: Range): boolean {
        return this.min === other.min && this.max === other.max
    }

    public clone(): Range {
        return new Range({ min: this.min, max: this.max })
    }

    public toString(): string {
        return `Range(${this.min} - ${this.max})`
    }
}