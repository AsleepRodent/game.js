import { Module, type ModuleAttributes } from "../module.js";
import { Window } from "./other/window.js";
import { Render, RenderSpace } from "./other/render.js";
import type { Loop } from "../loop/loop.js";
import r from "@r1tsuu/raylib"

export class Renderer extends Module {
    public window: Window;
    private renders: Render[] = [];
    private lastSeen: Map<Render, number> = new Map();

    constructor(attributes: ModuleAttributes) {
        super(attributes)
        this.window = new Window({parent:this, title:this.parent.name})
        
        this.render.connect(() => {
            this.process();
        });
    }

    public addToRenders(render: Render): void {
        if (!this.renders.includes(render)) {
            this.renders.push(render);
        }
        this.lastSeen.set(render, r.GetTime());
    }

    private process(): void {
        if (!this.enabled) return;

        const loop = this.parent.modules.loop;
        if (loop) {
            for (const layer of loop.queue) {
                for (const module of layer) {
                    if (module !== this) module.render.fire();
                }
            }
        }

        r.BeginDrawing();
        r.ClearBackground(r.RAYWHITE);

        const camera = this.parent.modules.director?.currentScene?.camera;

        const renderData = this.renders
            .filter(render => render.transform.parent.enabled)
            .map(render => ({ 
                instance: render, 
                data: render.getFinal() 
            }))
            .sort((a, b) => a.data.depth - b.data.depth);

        const camPos = camera?.raw.position ?? { x: 0, y: 0 };
        const offsetX = this.window.width / 2;
        const offsetY = this.window.height / 2;

        for (const item of renderData) {
            if (item.data.space === RenderSpace.World) {
                item.data.position.x = item.data.position.x - camPos.x + offsetX;
                item.data.position.y = item.data.position.y - camPos.y + offsetY;
            }
            item.instance.execute(item.data);
        }

        r.EndDrawing();
        this.renders = []; 
    }

    public override start(): void {
        if (!this.enabled) {
            (this.parent.modules.loop as Loop).addToQueue(this, 999);
            this.window.open();
            this.enabled = true;
        }
    }
}