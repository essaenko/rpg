import Dummy from './dummy/dummy.json'

export const maps = {
  'dummy': Dummy
} as const;

export const isMapKey = (key: unknown): key is keyof typeof maps => {
  return typeof key === 'string' && key in maps;
}