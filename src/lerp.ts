// The amazing always useful LERP function:
export const lerp = (start: number, end: number, t: number) => {
  return start * (1 - t) + end * t;
};
