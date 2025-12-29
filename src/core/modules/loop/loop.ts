import { Module, type ModuleAttributes } from "../module.js";
import type { Game } from "../game/game.js";
import type { Renderer } from "../renderer/renderer.js";

import r from 'raylib'

interface LoopAttributes extends ModuleAttributes {}

export class Loop extends Module {
    public queue: Module[][];

    constructor(attributes: LoopAttributes) {
        super(attributes)
        this.queue = [[], [], [], [], []]
    }

    public add(module: Module, layer: number): void {
        if (layer >= 0 && layer < this.queue.length) {
            let exists = false;
            for (const l of this.queue) {
                if (l.includes(module)) {
                    exists = true;
                    break;
                }
            }
            if (!exists) {
                const selectedLayer = this.queue[layer];
                if (selectedLayer) {
                    selectedLayer.push(module);
                }
            }
        }
    }

    public remove(module: Module): void {
        for (const layer of this.queue) {
            const index = layer.indexOf(module);
            if (index !== -1) {
                layer.splice(index, 1);
                break;
            }
        }
    }

    private run(): void {
        if (this.enabled) {
            const renderer: Renderer = this.parent.modules.renderer;
            (this.parent as Game).onStart?.();
            while (this.enabled && !r.WindowShouldClose()) {
                const dt: number = r.GetFrameTime();
                for (const layer of this.queue) {
                    for (const module of layer) {
                        (module as Module).update?.(dt);
                    }
                }
                if (renderer) {
                    (renderer as Renderer).render?.();
                }
                (this.parent as Game).onUpdate?.(dt);
            }
            this.stop();
        }
    }
    
    public start(): void {
        if (!this.enabled) {
            this.enabled = true
            this.run()
        }
    }
}