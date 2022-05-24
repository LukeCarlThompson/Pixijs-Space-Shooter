import * as PIXI from 'pixi.js';
import { lerp } from './utils/lerp';
import type { App } from './App';
import { getAngleX, getAngleY } from './utils/getAngle';
import imagepath from './images/Spaceship_Asset.png';
import { getAngleBetweenTwoPoints } from './utils/getAngle';
import { BulletEntity } from './BulletEntity';

const spriteCoords = {
  x: [0, 64, 128],
  y: [0, 64, 128, 192],
};

export class PlayerEntity {
  constructor(app: App) {
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

    ship.zIndex = 10;

    this.entity = ship;

    app.player = this;

    app.pixi.stage.addChild(ship);

    // Create an array for the bullets
    this.bullets = [];

    this.shootInterval = 0;

    const shootBullet = () => {
      this.shoot(app);
    };

    // Listen for clicks and shoot
    window.addEventListener('mousedown', () => {
      this.shoot(app);
      this.shootInterval = setInterval(shootBullet, 100);
    });

    // Listen for clicks and shoot
    window.addEventListener('mouseup', () => {
      clearInterval(this.shootInterval);
    });
  }

  texture;
  entity;
  bullets: BulletEntity[];
  shootInterval: number;

  shoot(app: App) {
    this.bullets.push(new BulletEntity(15, this.entity.rotation - 1.5, app));
  }

  update({ delta, app }: { delta: number; app: App }) {
    // Update sprites if thrust has changed
    const limitedThrust = app.state.thrust >= spriteCoords.x.length - 1 ? spriteCoords.x.length - 1 : app.state.thrust;
    if (
      this.texture.frame.x !== spriteCoords.x[limitedThrust] ||
      this.texture.frame.y !== spriteCoords.x[app.state.level]
    ) {
      this.texture.frame.x = spriteCoords.x[limitedThrust];
      this.texture.frame.y = spriteCoords.x[app.state.level];
      this.texture.updateUvs();
    }

    // Update position from app state
    const currentPositionX = lerp(this.entity.position.x, app.state.playerX, delta * 0.01);
    const currentPositionY = lerp(this.entity.position.y, app.state.playerY, delta * 0.01);
    this.entity.position.x = currentPositionX;
    this.entity.position.y = currentPositionY;

    // Point ship towards mouse
    const wobble = Math.sin(Date.now() * 0.005) * 0.05 * -0.5;
    // TODO: Normalise the angle when it loops so I can lerp the values
    const angleToMouse = getAngleBetweenTwoPoints(
      app.state.mouseX,
      app.state.mouseY,
      currentPositionX,
      currentPositionY,
    );
    app.state.playerAngleToMouse = angleToMouse;
    this.entity.rotation = app.state.playerAngleToMouse + 1.5 + wobble;

    // Move ship if thrust is above 0
    app.state.playerX += getAngleX(app.state.thrust, app.state.thrustAngle);
    app.state.playerY += getAngleY(app.state.thrust, app.state.thrustAngle);

    // Update the bullets
    this.bullets.forEach((bullet) => {
      bullet.update({ delta, app });
      if (bullet.isOutOfViewport) {
        bullet.removeFromStage(app);
        this.bullets = this.bullets.filter((item) => item !== bullet);
      }
    });
  }
}
