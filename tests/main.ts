import { Game, type GameAttributes, Actor, Scene, Director } from "../src/index.js"
import r from "raylib";

interface TestInterface extends GameAttributes {}

class LogoIcon extends Actor {
    public override render(): void {
        const sw = r.GetScreenWidth();
        const sh = r.GetScreenHeight();
        
        const tsblue = { r: 49, g: 120, b: 198, a: 255 };

        r.DrawRectangle(sw / 2 - 128, sh / 2 - 128, 256, 256, tsblue);
        r.DrawRectangle(sw / 2 - 112, sh / 2 - 112, 224, 224, r.RAYWHITE);
        
        r.DrawText(
            "game.ts", 
            sw / 2 - 80, 
            sh / 2 + 48, 
            50, 
            tsblue
        );
    }
}

export class Test extends Game {
    private exported: boolean = false;

    constructor(attributes: TestInterface) {
        super(attributes);
    }

    public override onStart(): void {
        const director = this.modules.director as Director;
        const logoScene = new Scene({ parent: director, name: "LogoScene" });
        new LogoIcon({ parent: logoScene, name: "LogoIcon" });
        director.switchCurrentScene("LogoScene");
    }

    public override onUpdate(dt: number): void {
        if (!this.exported) {
            const sw = r.GetScreenWidth();
            const sh = r.GetScreenHeight();

            const fullScreenImage = r.LoadImageFromScreen();

            const cropRect = { 
                x: sw / 2 - 128, 
                y: sh / 2 - 128, 
                width: 256, 
                height: 256 
            };

            const logoImage = r.ImageFromImage(fullScreenImage, cropRect);

            r.ExportImage(logoImage, "logo_clean.png");

            r.UnloadImage(fullScreenImage);
            r.UnloadImage(logoImage);

            this.exported = true;
            console.log("Icono recortado exportado como logo_clean.png");
        }

        if (r.IsKeyPressed(r.KEY_ESCAPE)) {
            this.stop();
        }
    }
}

const test: Test = new Test({ parent: null, name: "game.js - Exportador" });
test.start();