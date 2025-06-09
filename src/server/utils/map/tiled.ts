import { Pointer2D } from '@shared/types';

export const positionToTile = (x: number, y: number): Pointer2D => {
  return {
    x: Math.floor(x / 32),
    y: Math.floor(y / 32),
  };
};

export const tileToPosition = (x: number, y: number): Pointer2D => {
  return {
    x: x * 32 + 16,
    y: y * 32 + 16,
  };
};
