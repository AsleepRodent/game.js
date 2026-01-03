import { Module, type ModuleAttributes } from "../module.js";
import { Loop } from "../loop/loop.js";
import { Renderer } from "../renderer/renderer.js";
import { Director } from "../director/director.js";
import { Dispatch } from "../dispatch/dispatch.js";
import { Signal } from "../dispatch/other/signal.js";

export interface GameAttributes extends ModuleAttributes {};

export class Game extends Module {
    public modules: Record<string, Module>;
    public onStart: Signal;
    public onUpdate: Signal;

    constructor(attributes: GameAttributes) {
        super(attributes);
        this.modules = {
            "loop": new Loop({parent:this}),
            "renderer": new Renderer({parent:this}),
            "director": new Director({parent:this}),
            "dispatch": new Dispatch({parent:this})
        }

        this.onStart = new Signal({});
        this.onUpdate = new Signal({});
        
    }

    public override start(): void {
        this.modules.renderer!.start();
        this.modules.dispatch!.start();
        this.modules.director!.start();
        this.modules.loop!.start();
        this.enabled = true;
    } 

    public override stop(): void {
        this.modules.renderer!.stop();
        this.modules.director!.stop();
        this.modules.dispatch!.stop();
        this.modules.loop!.stop();
        this.enabled = false;
    }
}