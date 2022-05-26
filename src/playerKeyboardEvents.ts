import type { App } from './App';

export const playerKeyboardEvents = ({ player }: { player: App['player'] }) => {
  let timeoutCancel: number;
  let intervalIncrease: number;
  let intervalDecrease: number;

  window.addEventListener('keydown', (e) => {
    if (e.code === 'Space') {
      clearTimeout(timeoutCancel);
      clearTimeout(intervalIncrease);
      player.increaseThrust();
      timeoutCancel = setTimeout(player.cancelThrust, 1000);
      intervalIncrease = setInterval(player.increaseThrust, 100);
    }
  });

  window.addEventListener('keyup', (e) => {
    if (e.code === 'Space') {
      clearTimeout(intervalDecrease);
      clearTimeout(intervalIncrease);
      intervalDecrease = setTimeout(player.decreaseThrust, 200);
    }
  });
};
