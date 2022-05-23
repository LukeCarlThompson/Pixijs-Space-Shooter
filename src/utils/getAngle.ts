export const getAngleBetweenTwoPoints = (mx: number, my: number, px: number, py: number) => {
  var distX = my - py;
  var distY = mx - px;
  var angle = Math.atan2(distX, distY);
  // var degrees = angle * 180/ Math.PI;
  return angle;
};

export const getAngleX = (length: number, angle: number) => {
  return Math.cos(angle) * length;
};

export const getAngleY = (length: number, angle: number) => {
  return Math.sin(angle) * length;
};
