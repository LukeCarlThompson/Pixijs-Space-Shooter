import * as PIXI from "pixi.js";
import { lerp } from "./lerp";
import type { App } from "./App";

export class BoxEntity {
  constructor(app: App) {
    const graphics = new PIXI.Graphics();

    // Rectangle
    graphics.beginFill(0xcccccc);
    graphics.drawRect(-50, -50, 100, 100);
    graphics.endFill();
    graphics.position = new PIXI.ObservablePoint(() => {}, app.pixi, 200, 200);

    this.entity = graphics;

    app.pixi.stage.addChild(graphics);
  }

  entity;

  update(delta: number, appState: App["state"]) {
    const sinWobble = Math.sin(Date.now() * 0.005) * 0.1;

    this.entity.rotation += sinWobble;
    this.entity.position.x = lerp(this.entity.position.x, appState.mouseX, delta * 0.1);
    this.entity.position.y = lerp(this.entity.position.y, appState.mouseY, delta * 0.1);
  }
}
