import { Hit } from '@server/mechanics/spells/warrior/hit';
import { Spells } from '@shared/utils/spells';
import { Heal } from '@server/mechanics/spells/priest/heal';
import { Dot } from '@server/mechanics/spells/warrior/dot';
import { Hot } from '@server/mechanics/spells/priest/hot';
import { Shot } from './warrior/shot';
import { SplitFire } from '@server/mechanics/spells/rogue/split-fire';
import { Gather } from '@server/mechanics/spells/common/gather';
import { Loot } from '@server/mechanics/spells/common/loot';
import { Spell } from '@shared/schemas/game/spell/spell';

let instance: SpellsService = null;

export class SpellsService {
  private constructor() {}

  public spells = {
    [Spells.Hit]: Hit,
    [Spells.Heal]: Heal,
    [Spells.Dot]: Dot,
    [Spells.Hot]: Hot,
    [Spells.Shot]: Shot,
    [Spells.SplitFire]: SplitFire,
    [Spells.Gather]: Gather,
    [Spells.Loot]: Loot,
  };

  static get instance(): SpellsService {
    if (!instance) {
      instance = new SpellsService();
    }

    return instance;
  }

  public spellExists(id: number): id is Spells {
    return id in this.spells;
  }

  public createSpell(spell: Spells | number) {
    if (this.spellExists(spell)) {
      return new this.spells[spell]();
    }
  }
}
