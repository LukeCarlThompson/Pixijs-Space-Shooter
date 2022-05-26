import type { App } from './App';
import { getRandomArbitrary } from './utils/getRandomRange';
import { Asteroid } from './Asteroid';

interface AsteroidGeneratorProps {
  app: App;
  frequency: number;
}

export class AsteroidGenerator {
  constructor({ app, frequency }: AsteroidGeneratorProps) {
    this.asteroids = [];
    this.state = {
      frequency: frequency,
      isRunning: false,
    };

    this.createAsteroid = () => {
      const newAsteroid = new Asteroid({ position: { x: getRandomArbitrary(0, app.pixi.screen.width), y: -100 }, app });
      this.asteroids.push(newAsteroid);
    };
  }

  asteroids: Asteroid[];
  _asteroidTimeout = 0;
  createAsteroid;
  state;

  start = () => {
    this.state.isRunning = true;
    this.createAsteroid();

    if (this.state.isRunning) {
      clearTimeout(this._asteroidTimeout);

      this._asteroidTimeout = setTimeout(this.start, Math.random() * this.state.frequency + 300);
    }
  };

  stop = () => {
    this.state.isRunning = false;
    clearTimeout(this._asteroidTimeout);
  };

  update = ({ delta, app }: { delta: number; app: App }) => {
    this.asteroids.forEach((asteroid) => {
      asteroid.update({ delta, app });
    });
  };
}
