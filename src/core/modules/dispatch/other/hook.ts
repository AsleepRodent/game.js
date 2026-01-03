import { Signal } from "./signal.js";
import { Observer } from "./observer.js";

interface HookAttributes<T extends object> {
    target: T;
    search?: (key: string) => any;
}

export class Hook {
    public static create<T extends object>(attributes: HookAttributes<T>): T {
        const { target, search } = attributes;

        const observer = new Observer({
            parent: (target as any).parent ?? null,
            name: (target as any).name ?? "Object",
            scope: {} as Record<string, any>
        });

        const onChanged = observer.onChanged;
        const scope = observer.scope as Record<string, any>;

        (target as any).observer = observer;
        (target as any).onChanged = onChanged;

        for (const key in target) {
            if (typeof target[key] !== "function" && !(target[key] instanceof Signal)) {
                scope[key] = target[key];
            }
        }

        return new Proxy(target, {
            get: (t, key, receiver) => {
                if (Reflect.has(t, key)) {
                    const value = Reflect.get(t, key, receiver);
                    if (typeof value === "function") return value.bind(t);
                    return value;
                }

                if (typeof key === "string") {
                    if (key in scope) return scope[key];
                    const resolver = search ?? (t as any).onResolve;
                    if (typeof resolver === "function") return resolver.call(t, key);
                }
                return undefined;
            },
            set: (t, key, value, receiver) => {
                if (typeof key === "string") {
                    const isInternal = Reflect.has(t, key);
                    const oldValue = isInternal ? (t as any)[key] : scope[key];

                    if (oldValue !== value) {
                        if (!(value instanceof Signal)) {
                            if (isInternal) {
                                Reflect.set(t, key, value, receiver);
                                onChanged.fire(key, value, oldValue);
                            } else {
                                scope[key] = value; 
                            }
                        } else if (isInternal) {
                            Reflect.set(t, key, value, receiver);
                        }
                    }
                    return true;
                }
                return Reflect.set(t, key, value, receiver);
            }
        });
    }
}