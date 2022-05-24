import * as PIXI from 'pixi.js';
import type { App } from './App';
import imagepath from './images/Blue_Nebula_5.png';

export class BackgroundEntity {
  constructor(app: App) {
    const texture = PIXI.Texture.from(imagepath);
    /* create a tiling sprite ...
     * requires a texture, a width and a height
     * in WebGL the image size should preferably be a power of two
     */
    const tilingSprite = new PIXI.TilingSprite(texture, app.pixi.screen.width, app.pixi.screen.height);

    this.entity = tilingSprite;

    app.pixi.stage.addChild(tilingSprite);
  }

  entity;
  ticker = 0;

  update({ delta, app }: { delta: number; app: App }) {
    this.entity.tilePosition.x = (this.ticker + app.player.entity.position.x) * -0.2;
    this.entity.tilePosition.y = (this.ticker + app.player.entity.position.y) * -0.2;

    // TODO: Figure out why using delta properly actually causes jittering instead of preventing it.

    this.ticker++;

    this.entity.width = app.pixi.screen.width;
    this.entity.height = app.pixi.screen.height;
  }
}
