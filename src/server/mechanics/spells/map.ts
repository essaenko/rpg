import { Hit } from '@server/mechanics/spells/warrior/hit';

export const map = {
  'warrior-hit': Hit,
} as const;

export const isSpellName = (name: string): name is keyof typeof map => {
  return name in map;
};
