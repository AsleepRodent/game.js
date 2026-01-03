import { Signal } from "./signal.js";
import type { Dispatch } from "../dispatch.js";

import { nanoid } from "nanoid";

export interface ObserverAttributes<T extends object> {
    parent?: Dispatch | null;
    scope: T;
    name?: string;
    id?: string;
}

export class Observer<T extends object> {
    public parent: Dispatch | null;
    public name: string;
    public id: string;
    
    public onChanged: Signal;
    public scope: T;

    constructor(attributes: ObserverAttributes<T>) {
        this.parent = attributes.parent ?? null;
        this.name = attributes.name ?? "Observer";
        this.id = attributes.id ?? nanoid(8);

        if (this.parent && typeof (this.parent as any).addToObservers === "function") {
            (this.parent as any).addToObservers(this);
        }

        this.onChanged = new Signal({ 
            parent: this.parent, 
            name: `${this.name}_onChanged` 
        });

        this.scope = new Proxy(attributes.scope, {
            set: (target, key, value) => {
                const k = key as keyof T;
                const oldValue = target[k];

                if (oldValue !== value) {
                    target[k] = value;
                    this.onChanged.fire(k, value, oldValue);
                }
                return true;
            },
            get: (target, key) => {
                return target[key as keyof T];
            }
        });
    }
}