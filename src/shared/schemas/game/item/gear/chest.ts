import { GearItem } from '@shared/schemas/game/item/core/gear-item';
import { type } from '@colyseus/schema';
import type { ChestSave } from '@server/mongodb/types';
import { GearSlot } from '@shared/types';

export class Chest extends GearItem {
  factory = 'chest';

  constructor() {
    super();

    this.slot = GearSlot.Chest;
  }

  init(state: ChestSave): void {
    super.init(state);

  }

  validateSave(save: unknown): save is ChestSave {
    return super.validateSave(save);
  }
}
