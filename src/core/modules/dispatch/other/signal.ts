import type { Dispatch } from "../dispatch.js";
import { nanoid } from "nanoid";

export interface SignalAttributes {
    parent: Dispatch;
    name?: string;
    id?: string;
}

export class Connection {
    constructor(private disconnectFn: () => void) {}
    public disconnect(): void {
        this.disconnectFn();
    }
}

class InternalSignal {
    private listeners: Set<Function> = new Set();

    public connect(callback: Function): Connection {
        this.listeners.add(callback);
        return new Connection(() => this.listeners.delete(callback));
    }

    public _fire(...args: any[]): void {
        this.listeners.forEach(fn => fn(...args));
    }
}

export class Signal {
    public parent: Dispatch;
    public name: string;
    public id: string;
    public OnFire: InternalSignal;

    constructor(attributes: SignalAttributes) {
        this.parent = attributes.parent;
        this.name = attributes.name ?? "Signal";
        this.id = attributes.id ?? nanoid(8);
        this.OnFire = new InternalSignal();

        if (this.parent && "addToSignals" in this.parent) {
            (this.parent as any).addToSignals(this);
        }
    }

    public Fire(...args: any[]): void {
        this.OnFire._fire(...args);
    }
}