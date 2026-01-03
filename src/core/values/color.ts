import { Value, type ValueAttributes } from "./value.js";
import r from "@r1tsuu/raylib"

interface ColorAttributes extends ValueAttributes {
    r?: number,
    g?: number,
    b?: number,
    a?: number,
    hex?: string
}

export class Color extends Value {
    r: number
    g: number
    b: number
    a: number

    constructor(attributes: ColorAttributes) {
        super(attributes)
        
        if (attributes.hex) {
            const parsed = Color.parseHex(attributes.hex);
            this.r = parsed.r;
            this.g = parsed.g;
            this.b = parsed.b;
            this.a = parsed.a;
        } else {
            this.r = attributes.r ?? 0
            this.g = attributes.g ?? 0
            this.b = attributes.b ?? 0
            this.a = attributes.a ?? 255
        }
    }

    public static fromHex(hex: string): Color {
        return new Color({ hex });
    }

    private static parseHex(hex: string) {
        let h = hex.replace(/^#/, '');
        if (h.length === 3) h = h.split('').map(s => s + s).join('');
        if (h.length === 6) h += 'ff';
        const num = parseInt(h, 16);
        return {
            r: (num >> 24) & 255,
            g: (num >> 16) & 255,
            b: (num >> 8) & 255,
            a: num & 255
        };
    }

    public toHex(includeAlpha: boolean = true): string {
        const f = (v: number) => Math.round(v).toString(16).padStart(2, '0');
        const base = `#${f(this.r)}${f(this.g)}${f(this.b)}`;
        return includeAlpha ? base + f(this.a) : base;
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
        return this.toHex();
    }
}