import { Hit } from '@server/mechanics/spells/warrior/hit';
import { WarriorSpells } from '@shared/utils/spells';

export const map = {
  [WarriorSpells.Hit]: Hit,
} as const;

export const isSpellName = (name: string): name is keyof typeof map => {
  return name in map;
};
