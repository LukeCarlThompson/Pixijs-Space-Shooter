import type * as PIXI from 'pixi.js';

interface LoadTexturesAsyncProps {
  textures: { name: string; url: string }[];
  loader: PIXI.Loader;
  onProgress?: (loader: PIXI.Loader) => void;
}

export const loadTexturesAsync = async ({ textures, loader, onProgress }: LoadTexturesAsyncProps) => {
  return new Promise<PIXI.Loader | Error>((resolve, reject) => {
    textures.forEach((texture) => {
      loader.add(texture.name, texture.url);
    });

    loader.load();

    if (onProgress !== undefined) {
      loader.onProgress.add(onProgress);
    }

    loader.onComplete.add((loader) => {
      resolve(loader);
    });

    loader.onError.add((error) => {
      reject(error);
    });
  });
};
