import { Module, type ModuleAttributes } from "../module.js";
import { Loop } from "../loop/loop.js";
import { Renderer } from "../renderer/renderer.js";

export interface GameAttributes extends ModuleAttributes {}

export class Game extends Module {
    public modules: Record<string, Module>

    constructor(attributes: GameAttributes) {
        super(attributes);
        this.modules = {
            "loop": new Loop({parent:this}),
            "renderer": new Renderer({parent:this})
        }
    }

    public onStart(): void {}
    public onUpdate(dt: number): void {}

    public start(): void {
        this.modules.renderer!.start()
        this.modules.loop!.start()
        this.enabled = true
    } 
    public stop(): void {
        this.enabled = false
    }
}
