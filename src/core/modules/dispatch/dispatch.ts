import { Module, type ModuleAttributes } from "../module.js";
import type { Signal } from "./other/signal.js";
import type { Observer } from "./other/observer.js";

interface DispatchAttributes extends ModuleAttributes {}

export class Dispatch extends Module {
    public signals: Record<string, Signal>;
    public observers: Record<string, Observer<any>>;
    [key: string]: any;

    constructor(attributes: DispatchAttributes) {
        super(attributes);
        this.signals = {};
        this.observers = {};

        return new Proxy(this, {
            get: (target, prop: string | symbol) => {
                if (prop in target) return (target as any)[prop];

                if (typeof prop === "string") {
                    const signal = target.getFromSignals(prop);
                    if (signal) return signal;

                    const observer = target.getFromObservers(prop);
                    if (observer) return observer;
                }
                return undefined;
            }
        });
    }

    public getFromSignals(target: string): Signal | undefined {
        if (this.signals[target]) return this.signals[target];

        for (const key in this.signals) {
            const signal = this.signals[key];
            if (signal && (signal.id === target || signal.name === target)) {
                return signal;
            }
        }
        return undefined;
    }

    public addToSignals(signal: Signal): void {
        const exists = Object.values(this.signals).some(
            s => s === signal || s.id === signal.id
        );

        if (!exists) {
            this.signals[signal.name] = signal;
        }
    }

    public removeFromSignals(target: Signal | string): void {
        const id = typeof target === "string" ? target : target.id;
        
        if (typeof target === "string" && this.signals[target]) {
            delete this.signals[target];
            return;
        }

        for (const key in this.signals) {
            const signal = this.signals[key];
            if (signal && (signal.id === id || signal.name === id)) {
                delete this.signals[key];
                break;
            }
        }
    }

    public getFromObservers(target: string): Observer<any> | undefined {
        if (this.observers[target]) return this.observers[target];

        for (const key in this.observers) {
            const observer = this.observers[key];
            if (observer && (observer.id === target || observer.name === target)) {
                return observer;
            }
        }
        return undefined;
    }

    public addToObservers(observer: Observer<any>): void {
        const exists = Object.values(this.observers).some(
            o => o === observer || o.id === observer.id
        );

        if (!exists) {
            this.observers[observer.name] = observer;
        }
    }

    public removeFromObservers(target: Observer<any> | string): void {
        const id = typeof target === "string" ? target : target.id;

        if (typeof target === "string" && this.observers[target]) {
            delete this.observers[target];
            return;
        }

        for (const key in this.observers) {
            const observer = this.observers[key];
            if (observer && (observer.id === id || observer.name === id)) {
                delete this.observers[key];
                break;
            }
        }
    }

    public override start(): void {
        this.enabled = true;
    }
}