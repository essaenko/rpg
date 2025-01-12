import { Hit } from '@server/mechanics/spells/warrior/hit';
import { WarriorSpells } from '@shared/utils/spells';
import { Heal } from '@server/mechanics/spells/priest/heal';
import { Dot } from '@server/mechanics/spells/warrior/dot';
import { Hot } from '@server/mechanics/spells/priest/hot';

export const map = {
  [WarriorSpells.Hit]: Hit,
  [WarriorSpells.Heal]: Heal,
  [WarriorSpells.Dot]: Dot,
  [WarriorSpells.Hot]: Hot,
} as const;

export const isSpellName = (name: number): name is keyof typeof map => {
  return name in map;
};
