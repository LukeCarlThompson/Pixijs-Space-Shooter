import * as PIXI from 'pixi.js';
import asteroidImagePath from './images/asteroids.png';
import shipImagePath from './images/Spaceship_Asset.png';
import bgImagePath from './images/Blue_Nebula_5.png';
import explosionImagePath from './images/circle_explosion.png';
import { App } from './App';
import { loadTexturesAsync } from './loadTexturesAsync';

declare global {
  interface Window {
    PIXI: any;
  }
}

const canvas = document.querySelector<HTMLDivElement>('#canvas');

const createPixi = (parentEl: HTMLDivElement) => {
  const config = {
    backgroundColor: 0x000000,
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

  const textures = [
    { name: 'asteroid', url: asteroidImagePath },
    { name: 'ship', url: shipImagePath },
    { name: 'background', url: bgImagePath },
    { name: 'explosion', url: explosionImagePath },
  ];

  const onProgress = (loader: PIXI.Loader) => {
    // TODO: build a loading bar
    console.log(loader.progress);
  };

  await loadTexturesAsync({ textures, loader: pixi.loader, onProgress }).catch((error) => {
    // TODO: How to handle errors?
    console.error(error);
  });

  new App(pixi);

  // Add pixi to window for devtools
  // TODO: Set this up to only run in dev mode
  window.PIXI = PIXI;
};
