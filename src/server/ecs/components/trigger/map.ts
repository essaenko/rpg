import { MoveTarget } from './move-target';

export const map = {
  'move-target': MoveTarget,
} as const;

export const isTriggerFactoryKey = (key: unknown): key is keyof typeof map => {
  return typeof key === 'string' && key in map;
};
