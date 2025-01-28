import { Hit } from '@server/mechanics/spells/warrior/hit';
import { Spells } from '@shared/utils/spells';
import { Heal } from '@server/mechanics/spells/priest/heal';
import { Dot } from '@server/mechanics/spells/warrior/dot';
import { Hot } from '@server/mechanics/spells/priest/hot';

export const map = {
  [Spells.Hit]: Hit,
  [Spells.Heal]: Heal,
  [Spells.Dot]: Dot,
  [Spells.Hot]: Hot,
} as const;

export const isSpellName = (name: number): name is keyof typeof map => {
  return name in map;
};
