import { ChangeScene } from './change-scene';
import { LocationVisited } from './location-visited';
import { MoveTarget } from './move-target';

export const map = {
  'move-target': MoveTarget,
  'location-visited': LocationVisited,
  'change-scene': ChangeScene,
} as const;

export const isTriggerFactoryKey = (key: unknown): key is keyof typeof map => {
  return typeof key === 'string' && key in map;
};
