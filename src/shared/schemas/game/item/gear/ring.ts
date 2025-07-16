import { GearItem } from '@shared/schemas/game/item/core/gear-item';
import type { GearItemSave } from '@server/mongodb/types';
import { GearSlot } from '@shared/types';
import { entity } from '@colyseus/schema';

@entity
export class Ring extends GearItem {
  factory = 'ring';

  constructor() {
    super();

    this.slot = GearSlot.Ring;
  }

  init(state: GearItemSave): void {
    super.init(state);
  }
}
