import { GearItem } from '@shared/schemas/game/item/core/gear-item';
import type { FoodSave } from '@server/mongodb/types';
import { GearSlot } from '@shared/types';
import { type } from '@colyseus/schema';
import { SpellsService } from '@server/mechanics/spells/map';
import { Spells } from '@shared/utils/spells';

export class Food extends GearItem {
  factory = 'food';

  @type(Spells) food: Spells = null;

  constructor() {
    super();

    this.slot = GearSlot.Food;
  }

  init(state: FoodSave): void {
    super.init(state);

    this.food = +state.food;
  }
}
