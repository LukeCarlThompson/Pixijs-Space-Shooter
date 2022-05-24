import './style.css';

import * as PIXI from 'pixi.js';
import { lerp } from './utils/lerp';
import Stats from 'stats.js';
import { PlayerEntity } from './PlayerEntity';
import { keyboardEvents } from './keyboardEvents';

var stats = new Stats();
stats.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom
document.body.appendChild(stats.dom);

const constants = {
  maxThrust: 10,
  maxLevel: 3,
};

export class App {
  constructor(parentEl: HTMLDivElement) {
    // Create pixi instance
    this.pixi = this._CreatePixi(parentEl);

    // Create our player and add to the scene
    this.player = new PlayerEntity(this);

    // Add listeners
    window.addEventListener('mousemove', (e) => {
      this.state.velocityX = lerp(this.state.velocityX, Math.abs(this.state.mouseX - e.x), 0.1) * 0.5;
      this.state.mouseX = e.x;
      this.state.velocityY = lerp(this.state.velocityY, Math.abs(this.state.mouseY - e.y), 0.1);
      this.state.mouseY = e.y;
    });

    keyboardEvents({ app: this });

    // Add some stuff to the ticker
    this.pixi.ticker.add((delta) => {
      stats.begin();

      this.player.update({ delta, app: this });

      // console.log("app state -->", JSON.parse(JSON.stringify(this.state)));

      stats.end();
    });
  }

  pixi;

  player;

  state = {
    mouseX: 0,
    mouseY: 0,
    velocityX: 0,
    velocityY: 0,
    playerX: 0,
    playerY: 0,
    playerAngleToMouse: 0,

    thrustAngle: 1.5,
    _thrust: 0,
    get thrust() {
      return this._thrust;
    },
    set thrust(value: number) {
      this.thrustAngle = this.playerAngleToMouse;
      value <= constants.maxThrust ? (this._thrust = value) : null;
    },
    increaseThrust: function () {
      this.thrustAngle = this.playerAngleToMouse;
      this.thrust++;
    },
    decreaseThrust: function () {
      this.thrust !== 0 ? this.thrust-- : null;
    },

    _level: 0,
    get level() {
      return this._level;
    },
    set level(value: number) {
      value <= constants.maxLevel ? (this._level = value) : null;
    },
  };

  _CreatePixi(parentEl: HTMLDivElement) {
    const config = {
      backgroundColor: 0x1099bb,
      resizeTo: parentEl,
      resolution: window.devicePixelRatio || 1,
      autoDensity: true,
      antialias: true,
    };

    const pixiInstance = new PIXI.Application(config);
    pixiInstance.stage.sortableChildren = true;

    parentEl.appendChild(pixiInstance.view);

    return pixiInstance;
  }
}
