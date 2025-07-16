import { GearItem } from '@shared/schemas/game/item/core/gear-item';
import { GearItemSave } from '@server/mongodb/types';
import { GearSlot } from '@shared/types';
import { entity } from '@colyseus/schema';

@entity
export class Shoulder extends GearItem {
  factory = 'shoulder';

  constructor() {
    super();

    this.slot = GearSlot.Shoulder;
  }

  init(state: GearItemSave): void {
    super.init(state);
  }
}
