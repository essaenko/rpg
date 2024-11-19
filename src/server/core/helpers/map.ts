import { TiledMap } from '@shared/utils/types';
import { Position, Body } from '@shared/types';

export const getTileXY = (tile: number, map: TiledMap): Position => {
  return {
    x: (tile % map.width) * map.tilewidth,
    y: Math.floor(tile / map.width) * map.tileheight,
  };
};

export const collide = (b1: Position & Body, b2: Position & Body): boolean => {
  return b1.x < b2.x + b2.width && b1.x + b1.width > b2.x && b1.y < b2.y + b2.height && b1.y + b1.height > b2.y;
};
