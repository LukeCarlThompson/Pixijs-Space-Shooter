import './style.css';

import * as PIXI from 'pixi.js';
import Stats from 'stats.js';
import { Player } from './Player';
import { BackgroundEntity } from './Background';
import { mouseMoveEvents } from './mouseMoveEvents';
import { AsteroidGenerator } from './AsteroidGenerator';

var stats = new Stats();
stats.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom
document.body.appendChild(stats.dom);

export class App {
  constructor(pixi: PIXI.Application) {
    // Attach pixi instance
    this.pixi = pixi;

    // Add background
    this.background = new BackgroundEntity(this);

    // Create our player and add to the scene
    this.player = new Player(this);

    // Start the asteroid generator
    this.asteroidGenerator = new AsteroidGenerator({ app: this, frequency: 2000 });
    this.asteroidGenerator.start();

    // Add listener to track mouse position
    mouseMoveEvents({ app: this });

    // Add some stuff to the ticker
    this.pixi.ticker.add((delta) => {
      stats.begin();

      this.player.update({ delta, app: this });
      this.background.update({ delta, app: this });
      this.asteroidGenerator.update({ delta, app: this });

      stats.end();
    });
  }

  pixi;
  player;
  asteroidGenerator;
  background;

  state = {
    mouseX: 0,
    mouseY: 0,
    loading: true,
    loadingProgress: 0,
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
