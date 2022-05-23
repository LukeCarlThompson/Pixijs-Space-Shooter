import * as PIXI from "pixi.js";
import { lerp } from "./lerp";
import type { App } from "./App";
import { getAngleX, getAngleY } from "./utils/getAngle";
import imagepath from "./images/Spaceship_Asset.png";
import { getAngleBetweenTwoPoints } from "./utils/getAngle";
import { BulletEntity } from "./BulletEntity";

const spriteCoords = {
  x: [0, 64, 128],
  y: [0, 64, 128, 192],
};

export class PlayerEntity {
  constructor(app: App) {
    const thisPlayer = this;
    // create a new Sprite from an image texture
    const texture = PIXI.Texture.from(imagepath);
    texture.trim = new PIXI.Rectangle(0, 0, 100, 120);
    texture.frame = new PIXI.Rectangle();
    texture.frame.x = spriteCoords.x[0];
    texture.frame.y = spriteCoords.y[app.state.level];
    texture.frame.width = 61;
    texture.frame.height = 64;
    texture.updateUvs();

    this.texture = texture;
    const ship = PIXI.Sprite.from(texture);

    // center the sprite's anchor point
    ship.anchor.set(50, 60);
    ship.x = app.pixi.screen.width / 2;
    ship.y = app.pixi.screen.height / 2;
    app.state.playerX = app.pixi.screen.width / 2;
    app.state.playerY = app.pixi.screen.height / 2;

    this.entity = ship;

    app.player = this;

    app.pixi.stage.addChild(ship);

    // Create an array for the bullets
    this.bullets = [];

    // Listen for clicks and shoot
    window.addEventListener("click", () => {
      thisPlayer.shoot(app);
    });
  }

  texture;
  entity;

  bullets: BulletEntity[];

  shoot(app: App) {
    this.bullets.push(new BulletEntity(15, app.state.playerAngleToMouse, app));
  }

  update(delta: number, appState: App["state"]) {
    // Update sprites if thrust has changed
    const limitedThrust = appState.thrust >= spriteCoords.x.length - 1 ? spriteCoords.x.length - 1 : appState.thrust;
    if (
      this.texture.frame.x !== spriteCoords.x[limitedThrust] ||
      this.texture.frame.y !== spriteCoords.x[appState.level]
    ) {
      this.texture.frame.x = spriteCoords.x[limitedThrust];
      this.texture.frame.y = spriteCoords.x[appState.level];
      this.texture.updateUvs();
    }

    // Update position from app state
    const currentPositionX = lerp(this.entity.position.x, appState.playerX, delta * 0.01);
    const currentPositionY = lerp(this.entity.position.y, appState.playerY, delta * 0.01);
    this.entity.position.x = currentPositionX;
    this.entity.position.y = currentPositionY;

    // Point ship towards mouse
    const wobble = Math.sin(Date.now() * 0.005) * 0.05 * -0.5;
    // TODO: Normalise the angle when it loops so I can lerp the values
    const angleToMouse = getAngleBetweenTwoPoints(appState.mouseX, appState.mouseY, currentPositionX, currentPositionY);
    appState.playerAngleToMouse = angleToMouse;
    this.entity.rotation = appState.playerAngleToMouse + 1.5 + wobble;

    // Move ship if thrust is above 0
    appState.playerX += getAngleX(appState.thrust, appState.thrustAngle);
    appState.playerY += getAngleY(appState.thrust, appState.thrustAngle);

    // Update the bullets
    this.bullets.forEach((bullet) => {
      bullet.update(delta);
    });
  }
}
