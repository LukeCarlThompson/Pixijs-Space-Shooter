interface IsInsideRectangleProps {
  x: number;
  y: number;
  width: number;
  height: number;
}
export const isInsideRectangle = ({ x, y, width, height }: IsInsideRectangleProps) => {
  const outsideRectX = x > width || x < 0;
  const outsideRectY = y > height || y < 0;
  return !(outsideRectX || outsideRectY);
};
