import { Value, type ValueAttributes } from "./value.js";

import r from "@r1tsuu/raylib"

interface ColorAttributes extends ValueAttributes {
    r?: number,
    g?: number,
    b?: number,
    a?: number
}

export class Color extends Value {
    r: number
    g: number
    b: number
    a: number

    constructor(attributes: ColorAttributes) {
        super(attributes)
        this.r = attributes.r ?? 255
        this.g = attributes.g ?? 255
        this.b = attributes.b ?? 255
        this.a = attributes.a ?? 255
    }

    public get raw(): r.Color {
        return {
            r: this.r,
            g: this.g,
            b: this.b,
            a: this.a
        } as r.Color;
    }

    public add(other: Color): Color {
        return new Color({
            r: Math.min(255, this.r + other.r),
            g: Math.min(255, this.g + other.g),
            b: Math.min(255, this.b + other.b),
            a: Math.min(255, this.a + other.a)
        })
    }

    public sub(other: Color): Color {
        return new Color({
            r: Math.max(0, this.r - other.r),
            g: Math.max(0, this.g - other.g),
            b: Math.max(0, this.b - other.b),
            a: Math.max(0, this.a - other.a)
        })
    }

    public mul(scaler: number): Color {
        return new Color({
            r: Math.min(255, Math.max(0, this.r * scaler)),
            g: Math.min(255, Math.max(0, this.g * scaler)),
            b: Math.min(255, Math.max(0, this.b * scaler)),
            a: this.a 
        })
    }

    public div(scaler: number): Color {
        return new Color({
            r: this.r / scaler,
            g: this.g / scaler,
            b: this.b / scaler,
            a: this.a
        })
    }

    public inv(): Color {
        return new Color({
            r: 255 - this.r,
            g: 255 - this.g,
            b: 255 - this.b,
            a: this.a
        })
    }

    public equal(other: Color): boolean {
        return this.r === other.r && this.g === other.g && 
               this.b === other.b && this.a === other.a
    }

    public clone(): Color {
        return new Color({ r: this.r, g: this.g, b: this.b, a: this.a })
    }

    public toString(): string {
        return `RGBA(${this.r}, ${this.g}, ${this.b}, ${this.a})`
    }
}