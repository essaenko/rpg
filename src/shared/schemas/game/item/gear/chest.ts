import { GearItem } from '@shared/schemas/game/item/core/gear-item';
import { type } from '@colyseus/schema';
import type { ChestSave } from '@server/mongodb/types';
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

    if (state.dodge) {
      this.dodge = new GearSpellList();
      this.dodge.init(state.dodge);
    }
    if (state.save) {
      this.save = new GearSpellList();
      this.save.init(state.save);
    }
  }

  validateSave(save: unknown): save is ChestSave {
    return super.validateSave(save) && 'dodge' in save && 'save' in save;
  }
}
