import * as PIXI from 'pixi.js';
import type { App } from './App';
import { getAngleX, getAngleY } from './utils/getAngle';
import { getRandomInt } from './utils/getRandomRange';
import { isInsideRectangle } from './utils/isInsideRectangle';
import { Explosion } from './Explosion';
import { lerp } from './utils/lerp';

interface AsteroidProps {
  position?: { x: number; y: number };
  speed?: number;
  direction?: number;
  app: App;
}

const spriteDimension = 247;
const spriteRowSize = 247;
const spriteRows = 8;

export class Asteroid {
  constructor({ position = { x: 0, y: 0 }, direction = 1.5, speed = 2, app }: AsteroidProps) {
    this.state = {
      speed: speed,
      direction: direction,
      exploding: false,
      health: 20,
      takingDamage: false,
    };

    this.canBeDestroyed = false;

    setTimeout(() => {
      this.canBeDestroyed = true;
    }, 5000);

    const container = new PIXI.Container();

    this.container = container;

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

    //TODO: Remove this entity property in favour of container??
    this.entity = sprite;

    this.container.addChild(sprite);

    app.pixi.stage.addChild(this.container);

    this.explosion = null;

    this.takeDamage = ({ damage }: { damage: number }) => {
      this.state.health -= damage;
      this.state.speed = this.state.speed * 0.65;
      this.state.takingDamage = true;
      this.entity.tint = 0xff8359;
      if (this.state.health <= 0) {
        this.explode();
      }
    };

    this.explode = () => {
      this.container.zIndex = 9;
      // Create a new explosion
      this.explosion = new Explosion(app);
      this.explosion.entity.position.set(this.entity.width / 2, this.entity.height / 2);
      this.state.exploding = true;
      this.container.addChild(this.explosion.entity);
    };

    this.destroy = () => {
      app.asteroidGenerator.asteroids = app.asteroidGenerator.asteroids.filter((asteroid) => asteroid !== this);
      app.pixi.stage.removeChild(this.container);
      this.container.destroy({ children: true, texture: false, baseTexture: true });
    };
  }

  entity;
  state;
  canBeDestroyed = false;
  isInsideViewport = false;
  takeDamage;
  destroy;
  explosion: Explosion | null;
  explode;
  container;

  update({ delta, app }: { delta: number; app: App }) {
    const { speed, direction } = this.state;
    // Update position from app state
    this.entity.x += getAngleX(speed, direction) * delta;
    this.entity.y += getAngleY(speed, direction) * delta;

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

    if (!this.state.takingDamage) {
      this.entity.tint = 0xffffff;
    }

    this.state.takingDamage = false;

    if (this.canBeDestroyed && !this.isInsideViewport) {
      this.destroy();
    }

    if ((this.state.exploding = true && this.explosion !== null)) {
      this.explosion.update({ delta, position: { x: this.entity.position.x, y: this.entity.position.y } });

      if (this.explosion.state.step > 2) {
        this.entity.scale.set(lerp(this.entity.scale.x, 0.75, 0.2));
        this.entity.alpha = lerp(1, 0, 0.75);
      }
      if (this.explosion.state.step > 7) {
        this.entity.visible = false;
      }
      if (this.explosion.state.finished) {
        this.destroy();
      }
    }
  }
}
