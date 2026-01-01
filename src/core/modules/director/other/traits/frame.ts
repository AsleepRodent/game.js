import { Trait, type TraitAttributes } from "./trait.js";
import { Render, RenderSpace } from "../../../renderer/other/render.js";
import { Vector } from "../../../../values/vector.js";
import { Dim } from "../../../../values/dim.js";
import { Rotation } from "../../../../values/rotation.js";
import type { Actor } from "../actor.js";
import r from "@r1tsuu/raylib";

interface FrameAttributes extends TraitAttributes {
    position?: Vector | Dim;
    size?: Vector | Dim;
    rotation?: Rotation;
    anchor?: Vector;
    backgroundColor?: r.Color;
    space?: RenderSpace;
}

export class Frame extends Trait {
    public position: Vector | Dim;
    public size: Vector | Dim;
    public rotation: Rotation;
    public anchor: Vector;
    public backgroundColor: r.Color;
    public space: RenderSpace;
    private renderCommand: Render;

    constructor(attributes: FrameAttributes) {
        super(attributes);
        
        this.position = attributes.position ?? new Dim({});
        this.size = attributes.size ?? new Dim({ offset: new Vector({ x: 100, y: 100 }) });
        this.rotation = attributes.rotation ?? new Rotation({});
        this.anchor = attributes.anchor ?? new Vector({ x: 0.5, y: 0.5 });
        this.backgroundColor = attributes.backgroundColor ?? r.GRAY;
        this.space = attributes.space ?? RenderSpace.World;

        const actor = this.parent as Actor;
        const renderer = actor.game.modules.renderer;

        this.renderCommand = new Render({
            parent: renderer,
            space: this.space,
            transform: actor.getFromTraits("Transform")!,
            position: this.position,
            size: this.size,
            rotation: this.rotation,
            anchor: this.anchor
        }, (data) => {
            r.DrawRectanglePro(
                { x: data.position.x, y: data.position.y, width: data.size.x, height: data.size.y },
                { x: data.anchor.x, y: data.anchor.y },
                data.rotation.z,
                this.backgroundColor
            );
        });
    }

    public override render(): void {
        this.renderCommand.refresh(this.position, this.size, this.rotation, this.anchor);
        this.parent.game.modules.renderer.addToRenders(this.renderCommand);
    }
}