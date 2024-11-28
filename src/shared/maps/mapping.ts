import Dummy from './dummy/dummy.json';
import { TiledMap } from '@shared/utils/types';

export const maps: Record<string, TiledMap> = {
  dummy: Dummy,
} as const;

export const isMapKey = (key: unknown): key is keyof typeof maps => {
  return typeof key === 'string' && key in maps;
};
