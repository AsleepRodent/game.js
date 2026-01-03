import { Module, type ModuleAttributes } from "../module.js";
import type { Scene } from "./other/scene.js";
import type { Loop } from "../loop/loop.js";

interface DirectorAttributes extends ModuleAttributes {}

export class Director extends Module {
    public scenes: Record<string, Scene>;
    public currentScene: Scene | null;

    constructor(attributes: DirectorAttributes) {
        super(attributes);
        this.scenes = {};
        this.currentScene = null;

        this.update.connect((dt: number) => {
            if (this.enabled && this.currentScene) {
                this.currentScene.update(dt);
            }
        });

        this.render.connect(() => {
            if (this.enabled && this.currentScene) {
                this.currentScene.render();
            }
        });
    }

    public switchCurrentScene(target: Scene | string): void {
        const nextScene = typeof target === "string" ? this.getFromScenes(target) : target;

        if (nextScene) {
            if (this.currentScene) {
                this.currentScene.enabled = false;
            }

            this.currentScene = nextScene;
            this.currentScene.enabled = true;
        }
    }

    public getFromScenes(target: string): Scene | undefined {
        if (this.scenes[target]) return this.scenes[target];

        for (const name in this.scenes) {
            const scene = this.scenes[name];
            if (scene && (scene.name === target || (scene as any).id === target)) {
                return scene;
            }
        }
        return undefined;
    }

    public addToScenes(scene: Scene): void {
        const exists = Object.values(this.scenes).some(
            s => s === scene || s.name === scene.name
        );

        if (!exists) {
            scene.parent = this;
            this.scenes[scene.name] = scene;
        }
    }

    public removeFromScenes(target: Scene | string): void {
        const id = typeof target === "string" ? target : target.name;

        if (this.currentScene && (this.currentScene === target || this.currentScene.name === id)) {
            this.currentScene = null;
        }

        if (typeof target === "string" && this.scenes[target]) {
            delete this.scenes[target];
            return;
        }

        for (const name in this.scenes) {
            const scene = this.scenes[name];
            if (scene && (scene.name === id || (scene as any).id === id)) {
                delete this.scenes[name];
                break;
            }
        }
    }

    public override start(): void {
        if (!this.enabled) {
            const loop: Loop = this.parent.modules.loop as Loop;
            if (loop) {
                loop.addToQueue(this, 1);
            }
            this.enabled = true;
        }
    }
}