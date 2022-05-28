import * as PIXI from 'pixi.js';
import type { App } from './App';
import { getAngleBetweenTwoPoints, getAngleX, getAngleY } from './utils/getAngle';
import { getRandomInt } from './utils/getRandomRange';
import { isInsideRectangle } from './utils/isInsideRectangle';

interface AsteroidProps {
  position?: { x: number; y: number };
  speed?: number;
  rotationSpeed?: number;
  app: App;
}

const spriteDimension = 247;
const spriteRowSize = 247;
const spriteRows = 8;

export class Asteroid {
  constructor({ position = { x: 0, y: 0 }, speed = 2, rotationSpeed = Math.random(), app }: AsteroidProps) {
    this.speed = speed;
    this.rotationSpeed = rotationSpeed;
    this.canBeDestroyed = false;

    setTimeout(() => {
      this.canBeDestroyed = true;
    }, 2000);

    const texture = app.pixi.loader.resources.asteroid.texture?.clone() || PIXI.Texture.EMPTY;
    texture.frame.x = spriteRowSize * getRandomInt(0, 7);
    texture.frame.y = spriteRowSize * getRandomInt(0, 7);
    texture.frame.width = spriteDimension;
    texture.frame.height = spriteDimension;
    texture.updateUvs();

    // create a new Sprite from texture
    const sprite = new PIXI.Sprite(texture);
    sprite.position.x = position.x;
    sprite.position.y = position.y;
    sprite.anchor.set(0.5);
    sprite.scale.set(0.5);
    sprite.rotation = 1;
    sprite.name = 'Asteroid';

    const angleToPlayer = getAngleBetweenTwoPoints(
      app.player.entity.position.x,
      app.player.entity.position.y,
      sprite.position.x,
      sprite.position.y,
    );

    this.direction = angleToPlayer + (Math.random() - 0.5) * 0.5;

    this.entity = sprite;

    app.pixi.stage.addChild(sprite);

    this.destroy = () => {
      app.asteroidGenerator.asteroids = app.asteroidGenerator.asteroids.filter((asteroid) => asteroid !== this);
      app.pixi.stage.removeChild(this.entity);
      this.entity.destroy({ children: true, texture: false, baseTexture: true });
    };
  }

  entity;
  speed;
  direction;
  rotationSpeed;
  canBeDestroyed = false;
  isInsideViewport = false;
  destroy;

  update({ delta, app }: { delta: number; app: App }) {
    // Update position from app state
    this.entity.x += getAngleX(this.speed, this.direction) * delta;
    this.entity.y += getAngleY(this.speed, this.direction) * delta;

    // Check if it is still on the screen
    this.isInsideViewport = isInsideRectangle({
      x: this.entity.x,
      y: this.entity.y,
      width: app.pixi.screen.width + this.entity.width,
      height: app.pixi.screen.height + this.entity.height,
    });

    if (this.isInsideViewport) {
      this.canBeDestroyed = true;
    }

    if (this.canBeDestroyed && !this.isInsideViewport) {
      this.destroy();
    }
  }
}
