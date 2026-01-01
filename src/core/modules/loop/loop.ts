import { Module, type ModuleAttributes } from "../module.js";
import type { Game } from "../game/game.js";
import type { Renderer } from "../renderer/renderer.js";

import r from "@r1tsuu/raylib"

interface LoopAttributes extends ModuleAttributes {}

export class Loop extends Module {
    public queue: Module[][];

    constructor(attributes: LoopAttributes) {
        super(attributes)
        this.queue = [[], [], [], [], []];
    }

    public addToQueue(module: Module, layer: number): void {
        if (layer >= 0 && layer < this.queue.length) {
            const exists = this.queue.some(l => l.some(m => m.id === module.id));

            if (!exists) {
                this.queue[layer]!.push(module);
            }
        }
    }

    public removeFromQueue(target: Module | string): void {
        const idToFind = typeof target === "string" ? target : target.id;

        for (const layer of this.queue) {
            const index = layer.findIndex(m => m.id === idToFind);
            if (index !== -1) {
                layer.splice(index, 1);
                break;
            }
        }
    }

    private run(): void {
        if (this.enabled) {
            const renderer = this.parent.modules.renderer as Renderer;
            (this.parent as Game).onStart?.();

            while (this.enabled && !r.WindowShouldClose()) {
                const dt: number = r.GetFrameTime();

                for (const layer of this.queue) {
                    for (const module of layer) {
                        if (module.enabled) {
                            module.update(dt);
                        }
                    }
                }

                if (renderer && renderer.enabled) {
                    renderer.render();
                }

                (this.parent as Game).onUpdate?.(dt);
            }
            this.stop();
        }
    }
    
    public override start(): void {
        if (!this.enabled) {
            this.enabled = true
            this.run()
        }
    }
}