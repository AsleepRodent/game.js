import type { Module } from "../../module.js";

import r from "@r1tsuu/raylib"

interface WindowAttributes {
    parent: Module;
    title?: string;
    width?: number;
    height?: number;
}

export class Window {
    public parent: Module
    public title: string;
    public width: number;
    public height: number;
    public enabled: boolean;

    constructor(attributes: WindowAttributes) {
        this.parent = attributes.parent 
        this.title = attributes.title ?? "Unknown";
        this.width = attributes.width ?? 800
        this.height = attributes.height ?? 600
        this.enabled = false
    }

    public open(): void {
        if (!this.enabled) {
            r.InitWindow(this.width, this.height, this.title)
        }
    }

    public close(): void {
        if (this.enabled) {
            r.CloseWindow()
        }
    }
    
    public update(dt: number): void {
        
    }
}