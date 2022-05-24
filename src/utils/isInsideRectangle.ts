import type * as PIXI from 'pixi.js';

interface IsInsideRectangleProps {
  x: number;
  y: number;
  rectangle: PIXI.Rectangle;
}
export const isInsideRectangle = ({ x, y, rectangle }: IsInsideRectangleProps) => {
  const outsideRectX = x > rectangle.width || x < 0;
  const outsideRectY = y > rectangle.height || y < 0;
  return !outsideRectX || !outsideRectY;
};
