import * as PIXI from 'pixi.js';
import type { App } from './App';
import { getAngleX, getAngleY } from './utils/getAngle';
import { isInsideRectangle } from './utils/isInsideRectangle';
import Victor from 'victor';

// create a new graphic
const graphic = new PIXI.Graphics();
graphic.lineStyle(1, 0x00ff00, 1);
graphic.beginFill(0xccffcc);
graphic.drawRoundedRect(-10, -1, 3, 1, 2);
graphic.drawRoundedRect(-5, -1, 5, 2, 2);
graphic.drawRoundedRect(3, -2, 10, 4, 2);
graphic.endFill();
graphic.name = 'Bullet';

export class Bullet {
  constructor(speed: number, direction: number, app: App) {
    this.state = {
      speed: speed,
      direction: direction,
      destroyed: false,
      damage: 7,
    };

    const texture = app.pixi.renderer.generateTexture(graphic);
    const sprite = new PIXI.Sprite(texture);
    sprite.x = app.player.entity.x;
    sprite.y = app.player.entity.y;
    sprite.name = 'Bullet';

    // Orient the bullet
    const randomAdjustment = (Math.random() - 0.5) * 0.01;
    sprite.rotation = direction + randomAdjustment;
    this.state.direction = direction + randomAdjustment;

    this.entity = sprite;

    app.pixi.stage.addChild(sprite);

    this.destroy = () => {
      this.state.destroyed = true;
      app.player.bullets = app.player.bullets.filter((item) => item !== this);
      app.pixi.stage.removeChild(this.entity);
      this.entity.destroy(true);
    };

    this.hitTest = () => {
      const asteroids = app.asteroidGenerator.asteroids;

      const hitAsteroids = asteroids.filter((asteroid) => {
        // TODO: Improve the hit test based on more precise locations of the sprites
        const bulletVec = new Victor(this.entity.x, this.entity.y);
        const asteroidVec = new Victor(asteroid.entity.x, asteroid.entity.y);

        const distanceBetween = bulletVec.distance(asteroidVec);
        const asteroidRadius = asteroid.entity.width / 2;

        const didHit = distanceBetween < asteroidRadius;

        return didHit ? asteroid : false;
      });

      return hitAsteroids;
    };

    this.update = (delta: number) => {
      const hitItems = this.hitTest();
      if (hitItems.length > 0) {
        let destroyBullet = false;

        // Update the items that were hit
        hitItems.forEach((item) => {
          if (!item.state.exploding) {
            item.takeDamage({ damage: this.state.damage });
            destroyBullet = true;
          }
        });

        if (destroyBullet) {
          this.destroy();
        }
      }

      if (this.state.destroyed) return;

      // Update position from app state
      this.entity.x += getAngleX(this.state.speed, this.state.direction) * delta;
      this.entity.y += getAngleY(this.state.speed, this.state.direction) * delta;

      // Check if it is still on the screen
      const isOutOfViewport = !isInsideRectangle({
        x: this.entity.x,
        y: this.entity.y,
        width: app.pixi.screen.width,
        height: app.pixi.screen.height,
      });

      if (isOutOfViewport) {
        this.destroy();
      }
    };
  }

  entity;
  state;
  hitTest;
  destroy;
  update;
}
