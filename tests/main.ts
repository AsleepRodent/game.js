import { 
    Game, 
    Actor, 
    Scene, 
    Director, 
    Transform, 
    Camera, 
    Frame, 
    Vector, 
    Dim,
    Rotation
} from "../src/index.js"
import r from "@r1tsuu/raylib"

export class TestHierarchyFinal extends Game {
    private testMode: number = 0;
    private tests: Array<{ name: string, setup: () => void }> = [];
    private currentScene: Scene | null = null;

    public override onStart(): void {
        this.setupTests();
        this.switchTest(0);
    }

    private setupTests(): void {
        this.tests = [
            { name: "1. Jerarquía Profunda (4 niveles)", setup: () => this.testDeepHierarchy() },
            { name: "2. Múltiples Hijos con DIM", setup: () => this.testMultipleChildren() },
            { name: "3. Mix DIM y Vector en Jerarquía", setup: () => this.testMixedHierarchy() },
            { name: "4. Anchors Diferentes", setup: () => this.testDifferentAnchors() },
            { name: "5. Rotación Acumulativa", setup: () => this.testCumulativeRotation() },
            { name: "6. Escala Acumulativa", setup: () => this.testCumulativeScale() },
            { name: "7. Posiciones Extremas", setup: () => this.testExtremePositions() },
            { name: "8. Stress Test (Grid 5x5)", setup: () => this.testStressGrid() }
        ];
    }

    private switchTest(index: number): void {
        this.testMode = index % this.tests.length;
        
        const director = this.modules.director as Director;
        
        // Limpiar escena anterior
        if (this.currentScene) {
            director.removeFromScenes(this.currentScene);
        }

        // Crear nueva escena
        this.currentScene = new Scene({ parent: director, name: `Test${index}` });

        const camActor = new Actor({ parent: this.currentScene, name: "Cam" });
        new Transform({ parent: camActor });
        this.currentScene.camera = new Camera({ parent: camActor });

        // Ejecutar test
        this.tests[this.testMode]!.setup();

        director.switchCurrentScene(this.currentScene);
    }

    // TEST 1: Jerarquía profunda (bisabuelo -> abuelo -> padre -> hijo)
    private testDeepHierarchy(): void {
        const colors = [r.RED, r.ORANGE, r.YELLOW, r.GREEN];
        let current: Actor | Scene = this.currentScene!;

        for (let i = 0; i < 4; i++) {
            const size = 200 - (i * 40);
            const actor = new Actor({ parent: current, name: `Level${i}` });
            
            new Transform({
                parent: actor,
                position: new Dim({ 
                    scale: new Vector({ x: 0.5, y: 0.5 }),
                    offset: new Vector({ x: 15, y: 15 })
                }),
                size: new Vector({ x: size, y: size }),
                rotation: new Rotation({ z: 15 * i })
            });

            new Frame({
                parent: actor,
                position: new Vector({}),
                size: new Vector({ x: size, y: size }),
                anchor: new Vector({ x: 0.5, y: 0.5 }),
                backgroundColor: r.Fade(colors[i]!, 0.5)
            });

            current = actor;
        }
    }

    // TEST 2: Múltiples hijos con DIM
    private testMultipleChildren(): void {
        const parent = new Actor({ parent: this.currentScene!, name: "Parent" });
        new Transform({
            parent: parent,
            position: new Vector({ x: 0, y: 0 }),
            size: new Vector({ x: 300, y: 300 })
        });
        new Frame({
            parent: parent,
            position: new Vector({}),
            size: new Vector({ x: 300, y: 300 }),
            anchor: new Vector({ x: 0.5, y: 0.5 }),
            backgroundColor: r.Fade(r.GRAY, 0.3)
        });

        // 9 hijos en grid 3x3
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                const child = new Actor({ parent: parent, name: `Child${i}-${j}` });
                new Transform({
                    parent: child,
                    position: new Dim({
                        scale: new Vector({ x: i * 0.333, y: j * 0.333 })
                    }),
                    size: new Dim({
                        scale: new Vector({ x: 0.25, y: 0.25 })
                    })
                });
                new Frame({
                    parent: child,
                    position: new Dim({}),
                    size: new Dim({ scale: new Vector({ x: 1, y: 1 }) }),
                    anchor: new Vector({ x: 0.5, y: 0.5 }),
                    backgroundColor: r.Color(
                        Math.floor(255 * (i / 2)),
                        Math.floor(255 * (j / 2)),
                        150,
                        255
                    )
                });
            }
        }
    }

    // TEST 3: Mix de DIM y Vector
    private testMixedHierarchy(): void {
        // Nivel 1: DIM
        const level1 = new Actor({ parent: this.currentScene!, name: "L1-DIM" });
        new Transform({
            parent: level1,
            position: new Dim({ scale: new Vector({ x: 0.3, y: 0.3 }) }),
            size: new Vector({ x: 200, y: 200 })
        });
        new Frame({
            parent: level1,
            size: new Vector({ x: 200, y: 200 }),
            anchor: new Vector({ x: 0.5, y: 0.5 }),
            backgroundColor: r.Fade(r.BLUE, 0.5)
        });

        // Nivel 2: Vector
        const level2 = new Actor({ parent: level1, name: "L2-VECTOR" });
        new Transform({
            parent: level2,
            position: new Vector({ x: 50, y: 50 }),
            size: new Vector({ x: 120, y: 120 })
        });
        new Frame({
            parent: level2,
            size: new Vector({ x: 120, y: 120 }),
            anchor: new Vector({ x: 0.5, y: 0.5 }),
            backgroundColor: r.Fade(r.GREEN, 0.5)
        });

        // Nivel 3: DIM again
        const level3 = new Actor({ parent: level2, name: "L3-DIM" });
        new Transform({
            parent: level3,
            position: new Dim({ scale: new Vector({ x: 0.5, y: 0.5 }) }),
            size: new Dim({ scale: new Vector({ x: 0.5, y: 0.5 }) })
        });
        new Frame({
            parent: level3,
            size: new Dim({ scale: new Vector({ x: 1, y: 1 }) }),
            anchor: new Vector({ x: 0.5, y: 0.5 }),
            backgroundColor: r.Fade(r.YELLOW, 0.8)
        });
    }

    // TEST 4: Diferentes anchors
    private testDifferentAnchors(): void {
        const anchors = [
            { x: 0, y: 0, name: "TL", color: r.RED },
            { x: 1, y: 0, name: "TR", color: r.GREEN },
            { x: 0.5, y: 0.5, name: "C", color: r.BLUE },
            { x: 0, y: 1, name: "BL", color: r.YELLOW },
            { x: 1, y: 1, name: "BR", color: r.PURPLE }
        ];

        anchors.forEach((anchor, i) => {
            const parent = new Actor({ parent: this.currentScene!, name: `Parent-${anchor.name}` });
            new Transform({
                parent: parent,
                position: new Vector({ 
                    x: (i - 2) * 120, 
                    y: 0 
                }),
                size: new Vector({ x: 100, y: 100 })
            });
            new Frame({
                parent: parent,
                size: new Vector({ x: 100, y: 100 }),
                anchor: new Vector({ x: anchor.x, y: anchor.y }),
                backgroundColor: r.Fade(anchor.color, 0.5)
            });

            // Hijo centrado con DIM
            const child = new Actor({ parent: parent, name: `Child-${anchor.name}` });
            new Transform({
                parent: child,
                position: new Dim({ scale: new Vector({ x: 0.5, y: 0.5 }) }),
                size: new Dim({ scale: new Vector({ x: 0.4, y: 0.4 }) })
            });
            new Frame({
                parent: child,
                size: new Dim({ scale: new Vector({ x: 1, y: 1 }) }),
                anchor: new Vector({ x: 0.5, y: 0.5 }),
                backgroundColor: r.WHITE
            });
        });
    }

    // TEST 5: Rotación acumulativa
    private testCumulativeRotation(): void {
        let current: Actor | Scene = this.currentScene!;
        const colors = [r.RED, r.GREEN, r.BLUE, r.YELLOW];

        for (let i = 0; i < 4; i++) {
            const actor = new Actor({ parent: current, name: `Rot${i}` });
            new Transform({
                parent: actor,
                position: new Dim({ scale: new Vector({ x: 0.5, y: 0.5 }) }),
                size: new Vector({ x: 200 - i * 40, y: 200 - i * 40 }),
                rotation: new Rotation({ z: 30 }) // Cada nivel rota 30°
            });
            new Frame({
                parent: actor,
                size: new Vector({ x: 200 - i * 40, y: 200 - i * 40 }),
                anchor: new Vector({ x: 0.5, y: 0.5 }),
                backgroundColor: r.Fade(colors[i]!, 0.6)
            });
            current = actor;
        }
    }

    // TEST 6: Escala acumulativa
    private testCumulativeScale(): void {
        // Crear contenedor inicial más grande
        const root = new Actor({ parent: this.currentScene!, name: "ScaleRoot" });
        new Transform({
            parent: root,
            position: new Vector({ x: 0, y: 0 }),
            size: new Vector({ x: 300, y: 300 })
        });
        new Frame({
            parent: root,
            size: new Vector({ x: 300, y: 300 }),
            anchor: new Vector({ x: 0.5, y: 0.5 }),
            backgroundColor: r.Fade(r.DARKGRAY, 0.3)
        });

        let current: Actor | Scene = root;

        for (let i = 0; i < 5; i++) {
            const actor = new Actor({ parent: current, name: `Scale${i}` });
            new Transform({
                parent: actor,
                position: new Dim({ scale: new Vector({ x: 0.5, y: 0.5 }) }),
                size: new Dim({ scale: new Vector({ x: 0.7, y: 0.7 }) }) // 70% del padre
            });
            new Frame({
                parent: actor,
                size: new Dim({ scale: new Vector({ x: 1, y: 1 }) }),
                anchor: new Vector({ x: 0.5, y: 0.5 }),
                backgroundColor: r.Color(
                    Math.floor(255 - i * 40),
                    Math.floor(100 + i * 30),
                    150,
                    255
                )
            });
            current = actor;
        }
    }

    // TEST 7: Posiciones extremas
    private testExtremePositions(): void {
        const positions = [
            { scale: { x: -0.2, y: -0.2 }, name: "Negative", color: r.RED },
            { scale: { x: 1.2, y: 0.5 }, name: "Over100", color: r.GREEN },
            { scale: { x: 0.5, y: 1.5 }, name: "OverY", color: r.BLUE },
            { scale: { x: 0, y: 0 }, offset: { x: 100, y: 100 }, name: "PureOffset", color: r.YELLOW }
        ];

        const parent = new Actor({ parent: this.currentScene!, name: "Parent" });
        new Transform({
            parent: parent,
            size: new Vector({ x: 300, y: 300 })
        });
        new Frame({
            parent: parent,
            size: new Vector({ x: 300, y: 300 }),
            anchor: new Vector({ x: 0.5, y: 0.5 }),
            backgroundColor: r.Fade(r.GRAY, 0.3)
        });

        positions.forEach(pos => {
            const child = new Actor({ parent: parent, name: pos.name });
            new Transform({
                parent: child,
                position: new Dim({
                    scale: new Vector({ x: pos.scale.x, y: pos.scale.y }),
                    offset: new Vector(pos.offset || {})
                }),
                size: new Vector({ x: 40, y: 40 })
            });
            new Frame({
                parent: child,
                size: new Vector({ x: 40, y: 40 }),
                anchor: new Vector({ x: 0.5, y: 0.5 }),
                backgroundColor: pos.color
            });
        });
    }

    // TEST 8: Stress test con grid 5x5
    private testStressGrid(): void {
        const parent = new Actor({ parent: this.currentScene!, name: "Grid" });
        new Transform({
            parent: parent,
            size: new Vector({ x: 400, y: 400 }),
            rotation: new Rotation({ z: 0 })
        });
        new Frame({
            parent: parent,
            size: new Vector({ x: 400, y: 400 }),
            anchor: new Vector({ x: 0.5, y: 0.5 }),
            backgroundColor: r.Fade(r.DARKGRAY, 0.2)
        });

        for (let i = 0; i < 5; i++) {
            for (let j = 0; j < 5; j++) {
                const child = new Actor({ parent: parent, name: `Cell${i}-${j}` });
                new Transform({
                    parent: child,
                    position: new Dim({
                        scale: new Vector({ x: i * 0.2, y: j * 0.2 }),
                        offset: new Vector({ x: 5, y: 5 })
                    }),
                    size: new Dim({
                        scale: new Vector({ x: 0.18, y: 0.18 })
                    }),
                    rotation: new Rotation({ z: (i + j) * 5 })
                });
                new Frame({
                    parent: child,
                    size: new Dim({ scale: new Vector({ x: 1, y: 1 }) }),
                    anchor: new Vector({ x: 0.5, y: 0.5 }),
                    backgroundColor: r.Color(
                        Math.floor((i / 4) * 255),
                        Math.floor((j / 4) * 255),
                        150,
                        255
                    )
                });
            }
        }
    }

    public override onUpdate(dt: number): void {
        // Cambiar de test
        if (r.IsKeyPressed(r.KEY_RIGHT)) {
            this.switchTest(this.testMode + 1);
        }
        if (r.IsKeyPressed(r.KEY_LEFT)) {
            this.switchTest(this.testMode - 1 + this.tests.length);
        }

        // Controles para animar el test actual
        const actors = this.currentScene?.cast || [];
        if (actors.length > 0) {
            const rootActor = actors[0];
            if (rootActor) {
                const t = rootActor.getFromTraits<Transform>("Transform");
                if (t) {
                    if (r.IsKeyDown(r.KEY_R)) t.rotation.z += 50 * dt;
                    if (r.IsKeyDown(r.KEY_T)) {
                        const size = t.size as Vector;
                        if (size) {
                            const scale = 1 + Math.sin(r.GetTime() * 2) * 0.3;
                            size.x = 300 * scale;
                            size.y = 300 * scale;
                            const frame = rootActor.getFromTraits<Frame>("Frame");
                            if (frame) {
                                frame.size = new Vector({ x: size.x, y: size.y });
                            }
                        }
                    }
                }
            }
        }

        this.drawUI();
    }

    private drawUI(): void {
        r.DrawRectangle(10, 10, 450, 180, r.Fade(r.BLACK, 0.9));
        
        r.DrawText("TEST FINAL DE JERARQUIAS", 20, 20, 20, r.YELLOW);
        r.DrawText("═══════════════════════════════════", 20, 45, 16, r.GRAY);
        
        r.DrawText(`Test ${this.testMode + 1}/${this.tests.length}: ${this.tests[this.testMode]!.name}`, 
                   20, 70, 16, r.WHITE);
        
        r.DrawText("◀/▶  - Cambiar test", 20, 100, 14, r.LIGHTGRAY);
        r.DrawText("R    - Rotar primer elemento", 20, 120, 14, r.LIGHTGRAY);
        r.DrawText("T    - Animar escala primer elemento", 20, 140, 14, r.LIGHTGRAY);
        r.DrawText("ESC  - Salir", 20, 160, 14, r.RED);

        // Indicadores de tests
        const startX = 20;
        const startY = 200;
        for (let i = 0; i < this.tests.length; i++) {
            const color = i === this.testMode ? r.GREEN : r.GRAY;
            r.DrawCircle(startX + i * 25, startY, 8, color);
        }
    }
}

const test = new TestHierarchyFinal({ parent: null, name: "Test Final Jerarquías" });
test.start();

console.log(`
╔══════════════════════════════════════════════════════════════╗
║          TEST FINAL COMPREHENSIVO                             ║
╠══════════════════════════════════════════════════════════════╣
║                                                               ║
║ 8 TESTS PARA VALIDAR TODO EL SISTEMA:                        ║
║                                                               ║
║ 1️⃣  JERARQUÍA PROFUNDA (4 niveles)                           ║
║    → Bisabuelo → Abuelo → Padre → Hijo                       ║
║    → Cada nivel rota 15° y se desplaza con Dim               ║
║                                                               ║
║ 2️⃣  MÚLTIPLES HIJOS CON DIM                                  ║
║    → Grid 3x3 de hijos con posiciones Dim                    ║
║    → Verifica que los scales se calculen correctamente       ║
║                                                               ║
║ 3️⃣  MIX DIM Y VECTOR                                         ║
║    → Nivel 1: Dim, Nivel 2: Vector, Nivel 3: Dim            ║
║    → Prueba compatibilidad entre sistemas                    ║
║                                                               ║
║ 4️⃣  ANCHORS DIFERENTES                                       ║
║    → 5 cajas con anchors: TL, TR, Center, BL, BR            ║
║    → Cada una con hijo centrado usando Dim                   ║
║                                                               ║
║ 5️⃣  ROTACIÓN ACUMULATIVA                                     ║
║    → 4 niveles, cada uno rota 30° adicional                  ║
║    → Prueba worldRotation acumulativo                        ║
║                                                               ║
║ 6️⃣  ESCALA ACUMULATIVA                                       ║
║    → 5 niveles, cada uno al 70% del padre                    ║
║    → Prueba worldSize con Dim acumulativo                    ║
║                                                               ║
║ 7️⃣  POSICIONES EXTREMAS                                      ║
║    → Scales negativos, mayores a 1, offset puro              ║
║    → Prueba casos edge                                        ║
║                                                               ║
║ 8️⃣  STRESS TEST (Grid 5x5 = 25 elementos)                    ║
║    → 25 elementos con Dim, offset y rotación                 ║
║    → Prueba rendimiento y estabilidad                        ║
║                                                               ║
╠══════════════════════════════════════════════════════════════╣
║ CONTROLES:                                                    ║
║ • ◀/▶ para navegar entre tests                               ║
║ • R para rotar el elemento raíz                              ║
║ • T para animar la escala                                    ║
║                                                               ║
║ Si TODOS los tests se ven correctos → Sistema APROBADO ✓    ║
╚══════════════════════════════════════════════════════════════╝
`);