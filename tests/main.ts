import { Game, type GameAttributes } from "../src/core/modules/game/game.js";

interface TestInterface extends GameAttributes {}

export class Test extends Game {
    constructor(attributes: TestInterface) {
        super(attributes);
    }

    public override onStart(): void {
        console.log("¡El juego ha iniciado!");
    }

    public override onUpdate(dt: number): void {
        console.log("hola si")
    }
}

const test: Test = new Test({parent:null})
test.start()