import { Position } from '@shared/types';

export const positionToTile = (x: number, y: number): Position => {
  return {
    x: Math.floor(x / 32),
    y: Math.floor(y / 32),
  };
};

export const tileToPosition = (x: number, y: number): Position => {
  return {
    x: x * 32 + 16,
    y: y * 32 + 16,
  };
};
