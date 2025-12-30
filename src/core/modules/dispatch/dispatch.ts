import { Module, type ModuleAttributes } from "../module.js";
import { Signal } from "./other/signal.js";
import type { Loop } from "../loop/loop.js";

interface DispatchAttributes extends ModuleAttributes {}

export class Dispatch extends Module {
    public signals: Record<string, Signal>;

    constructor(attributes: DispatchAttributes) {
        super(attributes);
        this.signals = {};
    }

    public getFromSignals(target: string): Signal | undefined {
        if (this.signals[target]) return this.signals[target];

        for (const key in this.signals) {
            const signal = this.signals[key];
            if (signal && (signal.name === target || signal.id === target)) {
                return signal;
            }
        }
        return undefined;
    }

    public addToSignals(signal: Signal): void {
        const exists = Object.values(this.signals).some(
            s => s === signal || (s.name === signal.name && s.id === signal.id)
        );

        if (!exists) {
            this.signals[signal.name] = signal;
        }
    }

    public removeFromSignals(target: Signal | string): void {
        const identifier = typeof target === "string" ? target : target.name;

        if (typeof target === "string" && this.signals[target]) {
            delete this.signals[target];
            return;
        }

        for (const key in this.signals) {
            const signal = this.signals[key];
            if (signal && (signal.name === identifier || signal.id === identifier)) {
                delete this.signals[key];
                break;
            }
        }
    }

    public override start(): void {
        if (!this.enabled) {
            const loop = this.parent.modules.loop as Loop;
            if (loop) {
                loop.addToQueue(this, 0);
            }
            this.enabled = true;
        }
    }

    public override update(dt: number): void {
        if (!this.enabled) return;
    }
}