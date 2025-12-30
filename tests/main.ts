import { Game, type GameAttributes, Actor, Trait, Scene, Director, Signal, Dispatch } from "../src/index.js"


import r from "raylib";

interface TestInterface extends GameAttributes {}

export class Test extends Game {
    public player: Actor | null = null;

    constructor(attributes: TestInterface) {
        super(attributes);
    }

    public override onStart(): void {
        const director = this.modules.director as Director;
        const dispatch = this.modules.dispatch as Dispatch;

        const mainScene = new Scene({
            parent: director,
            name: "MainScene"
        });

        this.player = new Actor({
            parent: mainScene,
            name: "Player"
        });

        const explosionSignal = new Signal({
            parent: dispatch,
            name: "OnExplosion"
        });

        explosionSignal.OnFire.connect((intensity: number) => {
            console.log(`¡Señal recibida! Explosión con intensidad: ${intensity}`);
        });

        director.switchCurrentScene("MainScene");
    }

    public override onUpdate(dt: number): void {
        const dispatch = this.modules.dispatch as Dispatch;

        if (r.IsKeyPressed(r.KEY_SPACE)) {
            const signal = dispatch.getFromSignals("OnExplosion");
            if (signal) {
                signal.Fire(100);
            }
        }

        if (r.IsKeyPressed(r.KEY_ESCAPE)) {
            this.stop();
        }
    }
}

const test: Test = new Test({ parent: null, name: "Test" });
test.start();