import { GearItem } from '@shared/schemas/game/item/core/gear-item';
import { FoodSave, GearItemSave } from '@server/mongodb/types';
import { GearSlot } from '@shared/types';
import { type } from '@colyseus/schema';
import { Spell } from '@shared/schemas/game/spell/spell';
import { isSpellName, map } from '@server/mechanics/spells/map';

export class Food extends GearItem {
  factory = 'food';

  @type(Spell) food: Spell = null;

  constructor() {
    super();

    this.slot = GearSlot.Food;
  }

  init(state: FoodSave): void {
    super.init(state);

    if (isSpellName(state.food)) {
      this.food = new map[state.food]();
    }
  }
}
