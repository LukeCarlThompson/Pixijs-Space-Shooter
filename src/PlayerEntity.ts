import * as PIXI from 'pixi.js';
import { lerp } from './utils/lerp';
import type { App } from './App';
import { getAngleX, getAngleY } from './utils/getAngle';
import { getAngleBetweenTwoPoints } from './utils/getAngle';
import { BulletEntity } from './BulletEntity';
import { playerKeyboardEvents } from './playerKeyboardEvents';

const spriteCoords = {
  x: [0, 64, 128],
  y: [0, 64, 128, 192],
};

const constants = {
  maxThrust: 10,
  maxLevel: 3,
};

export class PlayerEntity {
  constructor(app: App) {
    // Set up some state
    this.state = {
      velocity: { x: 0, y: 0 },
      idealPosition: { x: app.pixi.screen.width / 2, y: app.pixi.screen.height / 2 },
      prevPosition: {
        x: app.pixi.screen.width / 2,
        y: app.pixi.screen.height / 2,
      },
      angleToMouse: 0,
      thrustAngle: 1.5,
      _thrust: 0,
      get thrust() {
        return this._thrust;
      },
      set thrust(value: number) {
        this.thrustAngle = this.angleToMouse;
        value <= constants.maxThrust ? (this._thrust = value) : null;
      },
      _level: 0,
      get level() {
        return this._level;
      },
      set level(value: number) {
        value <= constants.maxLevel ? (this._level = value) : null;
      },
    };

    // create a new Sprite from an image texture
    const texture = app.pixi.loader.resources.ship.texture || PIXI.Texture.EMPTY;
    texture.trim = new PIXI.Rectangle(0, 0, 100, 120);
    texture.frame.x = spriteCoords.x[0];
    texture.frame.y = spriteCoords.y[this.state.level];
    texture.frame.width = 64;
    texture.frame.height = 64;
    texture.updateUvs();

    this.texture = texture;
    const ship = PIXI.Sprite.from(texture);
    ship.x = this.state.idealPosition.x;
    ship.y = this.state.idealPosition.y;
    ship.anchor.set(0.78, 0.9);
    ship.zIndex = 10;

    this.entity = ship;

    app.player = this;

    app.pixi.stage.addChild(ship);

    this.shoot = () => {
      this.bullets.push(new BulletEntity(15, this.entity.rotation - 1.5, app));
    };

    // Create an array for the bullets
    this.bullets = [];

    this._shootInterval = 0;

    // Listen for clicks and shoot
    window.addEventListener('mousedown', () => {
      clearInterval(this._shootInterval);
      this.shoot();
      this._shootInterval = setInterval(this.shoot, 100);
    });

    // Listen for mouse up and stop shooting
    window.addEventListener('mouseup', () => {
      clearInterval(this._shootInterval);
    });

    playerKeyboardEvents({ player: this });
  }

  texture;
  entity;
  bullets: BulletEntity[];
  state;
  _shootInterval: number;
  shoot;

  increaseThrust = () => {
    this.state.thrust++;
  };

  decreaseThrust = () => {
    this.state.thrust !== 0 ? this.state.thrust-- : null;
  };

  cancelThrust = () => {
    this.state.thrust = 0;
  };

  update = ({ delta, app }: { delta: number; app: App }) => {
    // Update sprites if thrust has changed
    const limitedThrust =
      this.state.thrust >= spriteCoords.x.length - 1 ? spriteCoords.x.length - 1 : this.state.thrust;
    if (
      this.texture.frame.x !== spriteCoords.x[limitedThrust] ||
      this.texture.frame.y !== spriteCoords.x[this.state.level]
    ) {
      this.texture.frame.x = spriteCoords.x[limitedThrust];
      this.texture.frame.y = spriteCoords.x[this.state.level];
      this.texture.updateUvs();
    }

    // Update position from app state
    const currentPositionX = lerp(this.entity.position.x, this.state.idealPosition.x, delta * 0.01);
    const currentPositionY = lerp(this.entity.position.y, this.state.idealPosition.y, delta * 0.01);
    this.entity.position.x = currentPositionX;
    this.entity.position.y = currentPositionY;

    // Update velocity state
    this.state.velocity = {
      x: currentPositionX - this.state.prevPosition.x,
      y: currentPositionY - this.state.prevPosition.y,
    };

    // Update prev position
    this.state.prevPosition.x = currentPositionX;
    this.state.prevPosition.y = currentPositionY;

    // Point ship towards mouse
    // TODO: Normalise the angle when it loops so I can lerp the values
    const angleToMouse = getAngleBetweenTwoPoints(
      app.state.mouseX,
      app.state.mouseY,
      currentPositionX,
      currentPositionY,
    );
    this.state.angleToMouse = angleToMouse;
    this.entity.rotation = angleToMouse + 1.5;

    // Move ship if thrust is above 0
    this.state.idealPosition.x += getAngleX(this.state.thrust, this.state.thrustAngle);
    this.state.idealPosition.y += getAngleY(this.state.thrust, this.state.thrustAngle);

    // Update the bullets
    this.bullets.forEach((bullet) => {
      bullet.update(delta);
    });
  };
}
