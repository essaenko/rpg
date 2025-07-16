import { GearItem } from '@shared/schemas/game/item/core/gear-item';
import { type } from '@colyseus/schema';
import { Spell } from '@shared/schemas/game/spell/spell';
import { ChestSave } from '@server/mongodb/types';
import { isSpellName, map } from '@server/mechanics/spells/map';
import { GearSlot } from '@shared/types';
import { GearSpellList } from '@shared/schemas/game/item/core/gear-spell-list';

export class Chest extends GearItem {
  factory = 'chest';

  @type(GearSpellList) save: GearSpellList = null;
  @type(GearSpellList) dodge: GearSpellList = null;

  constructor() {
    super();

    this.slot = GearSlot.Chest;
  }

  init(state: ChestSave): void {
    super.init(state);

    (['save', 'dodge'] as const).forEach((key) => {
      if (state[key] && state[key].length > 0) {
        this[key] = new GearSpellList();

        state[key].forEach((spellID, index) => {
          if (isSpellName(spellID)) {
            const spell = new map[spellID]();

            this[key].spells.set(`tier_${index}`, spell);
          }
        });
      }
    });
  }

  validateSave(save: unknown): save is ChestSave {
    return super.validateSave(save) && 'dodge' in save && 'save' in save;
  }
}
