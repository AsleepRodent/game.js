import type { Dispatch } from "../dispatch.js";

import { nanoid } from "nanoid";

export interface SignalAttributes {
    parent?: Dispatch | null;
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

    public clear(): void {
        this.listeners.clear();
    }
}

export class Signal {
    public parent: Dispatch | null;
    public name: string;
    public id: string;
    private internal: InternalSignal;

    constructor(attributes: SignalAttributes) {
        this.parent = attributes.parent ?? null;
        this.name = attributes.name ?? "Signal";
        this.id = attributes.id ?? nanoid(8);
        this.internal = new InternalSignal();

        if (this.parent && typeof (this.parent as any).addToSignals === "function") {
            (this.parent as any).addToSignals(this);
        }
    }

    public connect(callback: Function): Connection {
        return this.internal.connect(callback);
    }

    public once(callback: Function): void {
        const conn = this.internal.connect((...args: any[]) => {
            callback(...args);
            conn.disconnect();
        });
    }

    public disconnectAll(): void {
        this.internal.clear();
    }

    public fire(...args: any[]): void {
        this.internal._fire(...args);
    }
}