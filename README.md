<img align="left" style="width:260px" src="./logo.svg" width="256px">

**game.ts is a lightweight, developer-friendly engine designed for seamless game development.**

Built upon the robust foundations of raylib, it provides a sophisticated Object-Oriented architectural pattern, empowering developers with rapid prototyping capabilities and highly modular tools.

> **Note:** This repository is currently a placeholder and is subject to significant architectural changes, API rewrites, and updates without prior notice.
> 

Ready to build? Explore the [test suite!](https://github.com/AsleepRodent/game.js/tree/main/tests)

---

<br>

[![GitHub Releases](https://img.shields.io/github/v/release/AsleepRodent/game.js)](https://github.com/AsleepRodent/game.js/releases)
[![GitHub Stars](https://img.shields.io/github/stars/AsleepRodent/game.js?style=flat&label=stars)](https://github.com/AsleepRodent/game.js/stargazers)
[![License](https://img.shields.io/badge/license-zlib%2Flibpng-blue.svg)](LICENSE)

Features
--------
  - **No External Dependencies**: Only raylib and your imagination.
  - **Pure OOP Architecture**: Robust Actor-Scene-Director pattern for structured logic.
  - **Decoupled Messaging**: Advanced Signal & Dispatch system for inter-module communication.
  - **Native TypeScript**: Full type safety, autocompletion, and modern ECMAScript features.
  - **Hardware Accelerated**: High-performance rendering via raylib's OpenGL abstraction.
  - **Free and Open Source**: Licensed under zlib/libpng.

Basic Example
--------------
This minimal example demonstrates how to initialize a scene and instantiate an actor.

```typescript
import { Game, Actor, Scene, Director } from "game.ts"

export class Example extends Game {
    public override onStart(): void {
        const director = this.modules.director as Director;
        const mainScene = new Scene({ parent: director, name: "MainScene" });
        
        // Actors are automatically managed by the scene lifecycle
        new Actor({ parent: mainScene, name: "MyActor" });
        
        director.switchCurrentScene("MainScene");
    }
}

const game = new Example({ parent: null, name: "Example" });
game.start();
