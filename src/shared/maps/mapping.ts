import Dummy from './dummy/dummy.json';
import DummyHouse from './dummy/dummy-house.json';
import ZavrazyeAsset from './zavrazye/zavrazye.json';
import { TiledMap } from '@shared/utils/types';

export const maps: Record<string, TiledMap> = {
  dummy: Dummy,
  'dummy-house': DummyHouse,
  zavrazye: ZavrazyeAsset,
} as const;

export const assets = {
  dummy: '@shared/maps/dummy/dummy.json?url',
  'dummy-house': '@shared/maps/dummy/dummy-house.json?url',
  zavrazye: '@shared/maps/zavrazye/zavrazye.json?url',
} as const;

export const isMapKey = (key: unknown): key is keyof typeof maps => {
  return typeof key === 'string' && key in maps;
};
