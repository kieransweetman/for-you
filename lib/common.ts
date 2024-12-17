export const width = globalThis.innerWidth;
export const height = globalThis.innerHeight;
export const aspect = width / height;
export const IS_MOBILE = width < 768;
export const bounds = {
  minX: -aspect * 10,
  maxX: aspect * 10,
  minY: -10,
  maxY: 10,
};
