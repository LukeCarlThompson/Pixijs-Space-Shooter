import type { App } from "./App";

export const keyboardEvents = (app: App) => {
  let timeoutCancel: number;
  let intervalIncrease: number;
  let intervalDecrease: number;

  const cancelThrust = () => {
    app.state.thrust = 0;
  };

  const increaseThrust = () => {
    app.state.increaseThrust();
  };

  const decreaseThrust = () => {
    app.state.decreaseThrust();
  };

  window.addEventListener("keydown", (e) => {
    if (e.code === "Space") {
      clearTimeout(timeoutCancel);
      clearTimeout(intervalIncrease);
      app.state.increaseThrust();
      timeoutCancel = setTimeout(cancelThrust, 1000);
      intervalIncrease = setInterval(increaseThrust, 100);
    }
  });

  window.addEventListener("keyup", (e) => {
    if (e.code === "Space") {
      clearTimeout(intervalDecrease);
      clearTimeout(intervalIncrease);
      intervalDecrease = setTimeout(decreaseThrust, 200);
    }
  });
};
