import type { App } from './App';
import { getRandomArbitrary } from './utils/getRandomRange';
import { Asteroid } from './Asteroid';

interface AsteroidGeneratorProps {
  app: App;
}

export class AsteroidGenerator {
  constructor({ app }: AsteroidGeneratorProps) {
    this.asteroids = [];

    this.createAsteroid = () => {
      const newAsteroid = new Asteroid({ position: { x: getRandomArbitrary(0, app.pixi.screen.width), y: -20 }, app });
      this.asteroids.push(newAsteroid);
    };

    this.start = () => {
      this.isRunning = true;
      this.createAsteroid();

      if (this.isRunning) {
        clearTimeout(this.asteroidTimeout);

        // BUG: Figure out why this hides all the asteroids
        this.asteroidTimeout = setTimeout(this.start, Math.random() * app.state.asteroidFrequency + 300);
      }
    };
  }

  asteroids: Asteroid[];
  isRunning = false;
  asteroidTimeout = 0;
  createAsteroid;

  start;

  stop() {
    this.isRunning = false;
    clearTimeout(this.asteroidTimeout);
    console.log('stopped');
  }

  update({ delta, app }: { delta: number; app: App }) {
    this.asteroids.forEach((asteroid) => {
      asteroid.update({ delta, app });
    });
  }
}
