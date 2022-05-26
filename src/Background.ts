import * as PIXI from 'pixi.js';
import type { App } from './App';

export class BackgroundEntity {
  constructor(app: App) {
    const texture = app.pixi.loader.resources.background.texture?.clone() || PIXI.Texture.EMPTY;
    /* create a tiling sprite ...
     * requires a texture, a width and a height
     * in WebGL the image size should preferably be a power of two
     */
    const tilingSprite = new PIXI.TilingSprite(texture, app.pixi.screen.width, app.pixi.screen.height);

    this.entity = tilingSprite;

    app.pixi.stage.addChild(tilingSprite);
  }

  entity;

  update({ delta, app }: { delta: number; app: App }) {
    this.entity.tilePosition.x = this.entity.tilePosition.x + (app.player.state.velocity.x * -0.2 + 0.1) * delta;
    this.entity.tilePosition.y = this.entity.tilePosition.y + (app.player.state.velocity.y * -0.2 + 0.25) * delta;

    this.entity.width = app.pixi.screen.width;
    this.entity.height = app.pixi.screen.height;
  }
}
