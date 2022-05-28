import * as PIXI from 'pixi.js';
import asteroidImagePath from './images/asteroids.png';
import shipImagePath from './images/Spaceship_Asset.png';
import bgImagePath from './images/Blue_Nebula_5.png';
import { App } from './App';

declare global {
  interface Window {
    PIXI: any;
  }
}

const canvas = document.querySelector<HTMLDivElement>('#canvas');

const createPixi = (parentEl: HTMLDivElement) => {
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
};

export const initApp = async () => {
  if (canvas === null) return;

  // TODO: Show something before the assets have loaded

  const pixi = createPixi(canvas);

  const textureLoader = pixi.loader;

  textureLoader.onComplete.add(() => {
    new App(pixi);

    // Add pixi to window for devtools
    // TODO: Set this up to only run in dev mode
    window.PIXI = PIXI;
  });

  // TODO: Make a loading indicator that uses app.pixi.loader.progress

  textureLoader.onError.add((e) => {
    // TODO: How to handle errors?
    console.log('loading error -->', e);
  });

  textureLoader.add('asteroid', asteroidImagePath);
  textureLoader.add('ship', shipImagePath);
  textureLoader.add('background', bgImagePath);
  textureLoader.load();
};
