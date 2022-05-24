import * as PIXI from 'pixi.js';
import type { App } from './App';
import { getAngleBetweenTwoPoints, getAngleX, getAngleY } from './utils/getAngle';
import imagepath from './images/asteroids.png';
import { getRandomInt } from './utils/getRandomRange';

interface AsteroidProps {
  speed?: number;
  rotationSpeed?: number;
  app: App;
}

const spriteDimension = 247;
const spriteRowSize = 247;
const spriteRows = 8;

export class Asteroid {
  constructor({ speed = 2, rotationSpeed = Math.random(), app }: AsteroidProps) {
    this.speed = speed;

    const texture = PIXI.Texture.from(imagepath);
    texture.trim = new PIXI.Rectangle(0, 0, 100, 100);
    texture.frame = new PIXI.Rectangle();
    texture.frame.x = spriteRowSize * getRandomInt(0, 7);
    texture.frame.y = spriteRowSize * getRandomInt(0, 7);
    texture.frame.width = spriteDimension;
    texture.frame.height = spriteDimension;
    texture.updateUvs();

    // create a new Sprite from texture
    const asteroid = PIXI.Sprite.from(texture);

    // Orient the asteroid
    asteroid.rotation = (Math.random() - 0.5) * 5;

    this.rotationSpeed = rotationSpeed;

    const angleToPlayer = getAngleBetweenTwoPoints(
      app.player.entity.position.x,
      app.player.entity.position.y,
      asteroid.position.x,
      asteroid.position.y,
    );

    this.direction = angleToPlayer + (Math.random() - 0.5) * 0.5;
    // this.direction = angleToPlayer;

    this.hasBeenInView = false;

    this.entity = asteroid;

    app.pixi.stage.addChild(asteroid);
  }

  entity;
  speed;
  direction;
  rotationSpeed;
  hasBeenInView;

  destroy(app: App) {
    app.pixi.stage.removeChild(this.entity);
    app.asteroids = app.asteroids.filter((asteroid) => asteroid !== this);
  }

  update({ delta, app }: { delta: number; app: App }) {
    // Update position from app state
    this.entity.x += getAngleX(this.speed, this.direction) * delta;
    this.entity.y += getAngleY(this.speed, this.direction) * delta;

    // Remove from scene if been on screen once then becomes off screen
    const offScreenX = this.entity.x > app.pixi.screen.width || this.entity.x < 0;
    const offScreenY = this.entity.y > app.pixi.screen.height || this.entity.y < 0;
    const isOutOfViewport = offScreenX || offScreenY;

    if (!isOutOfViewport) {
      this.hasBeenInView = true;
    }

    if (this.hasBeenInView && isOutOfViewport) {
      this.destroy(app);
    }
  }
}
