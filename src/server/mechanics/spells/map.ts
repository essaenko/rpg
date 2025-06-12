import { Hit } from '@server/mechanics/spells/warrior/hit';
import { Spells } from '@shared/utils/spells';
import { Heal } from '@server/mechanics/spells/priest/heal';
import { Dot } from '@server/mechanics/spells/warrior/dot';
import { Hot } from '@server/mechanics/spells/priest/hot';
import { Shot } from './warrior/shot';
import { SplitFire } from '@server/mechanics/spells/rogue/split-fire';
import { Gather } from '@server/mechanics/spells/common/gather';
import { Loot } from '@server/mechanics/spells/common/loot';

export const map = {
  [Spells.Hit]: Hit,
  [Spells.Heal]: Heal,
  [Spells.Dot]: Dot,
  [Spells.Hot]: Hot,
  [Spells.Shot]: Shot,
  [Spells.SplitFire]: SplitFire,
  [Spells.Gather]: Gather,
  [Spells.Loot]: Loot,
} as const;

export const isSpellName = (name: number): name is keyof typeof map => {
  return name in map;
};
