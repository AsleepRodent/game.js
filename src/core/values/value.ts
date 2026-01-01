export interface ValueAttributes {}

export abstract class Value {
    constructor(attributes: ValueAttributes) {}

    public abstract add(other: any): Value;
    public abstract sub(other: any): Value;
    public abstract mul(scaler: number): Value;
    public abstract div(scaler: number): Value;
    public abstract inv(): Value;

    public abstract equal(other: any): boolean;
    public abstract clone(): Value;

    public abstract toString(): string;
}