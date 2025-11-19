import { Spells } from '@shared/utils/spells';
import { GearItemSpellsSave } from '@server/mongodb/types';
import { GearSpellTier, GearSpellTierType } from '@shared/utils/gear';

export class GearSpellList {
  spells: Map<GearSpellTierType, Spells> = new Map();
  selected: Spells = null;

  init(state: GearItemSpellsSave) {
    if (state.spells) {
      for (const [tier, spell] of Object.entries(state.spells)) {
        this.spells.set(<GearSpellTierType>tier, spell);
      }
    }

    this.selected = state.selected ?? this.spells.get(GearSpellTier.Tier1);
  }

  serialize(): GearItemSpellsSave {
    return {
      selected: this.selected,
    };
  }
}
