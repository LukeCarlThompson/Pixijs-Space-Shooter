import * as PIXI from 'pixi.js';
import type { App } from './App';
import { getAngleX, getAngleY } from './utils/getAngle';

export class BulletEntity {
  constructor(speed: number, rotation: number, app: App) {
    this.speed = speed;

    // create a new Sprite from a shape
    const bullet = new PIXI.Graphics();
    // draw a rounded rectangle
    bullet.lineStyle(1, 0x00ff00, 1);
    bullet.beginFill(0xccffcc);
    bullet.drawRoundedRect(-10, -1, 3, 1, 2);
    bullet.drawRoundedRect(-5, -1, 5, 2, 2);
    bullet.drawRoundedRect(3, -2, 10, 4, 2);
    bullet.endFill();

    bullet.x = app.player.entity.x;
    bullet.y = app.player.entity.y;

    // Orient the bullet
    const randomAdjustment = (Math.random() - 0.5) * 0.01;
    bullet.rotation = rotation + randomAdjustment;
    this.rotation = rotation + randomAdjustment;

    this.entity = bullet;

    app.pixi.stage.addChild(bullet);
  }

  entity;
  rotation;
  speed;

  isOutOfViewport = false;

  removeFromStage(app: App) {
    app.pixi.stage.removeChild(this.entity);
  }

  update({ delta, app }: { delta: number; app: App }) {
    // Update position from app state
    this.entity.x += getAngleX(this.speed, this.rotation) * delta;
    this.entity.y += getAngleY(this.speed, this.rotation) * delta;

    // Remove from scene if off screen
    const offScreenX = this.entity.x > app.pixi.screen.width || this.entity.x < 0;
    const offScreenY = this.entity.y > app.pixi.screen.height || this.entity.y < 0;
    this.isOutOfViewport = offScreenX || offScreenY;
  }
}
