import { 
    Game, 
    Director, 
    Scene, 
    Actor,
    Transform,
    Frame,
    Vector,
    Dim,
    Color,
    RenderSpace,
    Signal,
    Trait
} from "../src/index.js"
import r from "@r1tsuu/raylib"

const game = new Game({ parent: null, name: "ReactiveEngine" });

game.onStart.connect(() => {
    const director = game.modules.director as Director;
    const mainScene = new Scene({ parent: director, name: "MainScene", index: 1 });
    const player = new Actor({ parent: mainScene, name: "Player" });

    player.onTraitAdded.connect((trait: Trait) => {
        console.log("Trait añadido:", trait.name);
    });
    
    new Transform({
        parent: player,
        position: new Vector({ x: 0, y: 0 })
    });
    
    const frame = new Frame({
        parent: player,
        backgroundColor: r.BLUE,
        size: new Dim({ offset: new Vector({ x: 50, y: 50 }) }),
        space: RenderSpace.World
    });
    
    let timer = 0;
    const sampleSignal = new Signal({});

    sampleSignal.connect(() => {
        console.log("Evento A presionado en:", player.name);
    });
    
    player.update.connect((dt: number) => {
        timer += dt;
        (player as any).Transform.position.x += 100 * dt;
        
        if (timer > 2) {
            frame.backgroundColor = new Color({ hex: "#ff00007e" }).raw;
            timer = 0;
        }

        if (r.IsKeyPressed(r.KEY_A)) {
            sampleSignal.fire();
        }
    });

    director.switchCurrentScene("MainScene");
}); 

game.start();