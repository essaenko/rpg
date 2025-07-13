import { Item } from '@shared/schemas/game/item/item';
import { type } from '@colyseus/schema';
import { EquipSlot } from '@shared/types';
import { EquipItemSave } from '@server/mongodb/types';

export class GearItem extends Item {
  constructor() {
    super();
  }
  factory = 'gear-item';
  @type('number') slot: EquipSlot;
  @type('string') effect: string = null;

  init(state: EquipItemSave): void {
    super.init(state);

    this.slot = state.slot;
    this.effect = state.effect;
  }
}
