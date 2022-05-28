import * as PIXI from 'pixi.js';
import type { App } from './App';

const spriteCoords = {
  width: 256,
  length: 10,
};

export class Explosion {
  constructor(app: App) {
    // Set up some state
    this.state = {
      step: 0,
      finished: false,
    };

    // create a new Sprite from an image texture
    const texture = app.pixi.loader.resources.explosion.texture?.clone() || PIXI.Texture.EMPTY;
    // texture.trim = new PIXI.Rectangle(0, 0, 256, 256);
    texture.frame.x = spriteCoords.width * this.state.step;
    texture.frame.width = spriteCoords.width;
    texture.frame.height = spriteCoords.width;
    texture.updateUvs();

    this.texture = texture;
    const sprite = PIXI.Sprite.from(texture);
    sprite.anchor.set(0.5);
    sprite.scale.set(2);
    sprite.name = 'Explosion';

    console.log(sprite);

    this.entity = sprite;

    // TODO: Add this to the object that is exploding?
    app.pixi.stage.addChild(sprite);
  }

  texture;
  entity;
  state;
  lastFrameTime = Date.now();

  update = ({ delta, position }: { delta: number; position: { x: number; y: number } }) => {
    if (this.state.finished) return;
    this.entity.position.set(position.x, position.y);
    // Update sprites if step has changed
    if (this.state.step < spriteCoords.length) {
      const timeSinceLastFrame = Date.now() - this.lastFrameTime;
      this.entity.scale.set(this.entity.scale.x + delta * 0.05);
      if (timeSinceLastFrame > 16.16 * (this.state.step * 0.25 + 1)) {
        this.lastFrameTime = Date.now();
        this.state.step++;
        this.texture.frame.x = spriteCoords.width * this.state.step;
        this.texture.updateUvs();
        // console.log('step -->', this.state.step);
      }
    } else {
      this.state.step = 0;
      this.entity.scale.set(2);
      this.state.finished = true;

      // Destroy
    }
  };
}
