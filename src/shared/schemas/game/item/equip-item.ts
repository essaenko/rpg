import { Item } from '@shared/schemas/game/item/item';
import { type } from '@colyseus/schema';
import { EquipSlot } from '@shared/types';
import { EquipItemSave } from '@server/mongodb/types';

export class EquipItem extends Item {
  constructor() {
    super();
  }
  factory = 'equip-item';
  @type('number') slot: EquipSlot;
  @type('string') effect: string = null;

  init(state: EquipItemSave): void {
    this.slot = state.slot;
    this.effect = state.effect;
  }
}
