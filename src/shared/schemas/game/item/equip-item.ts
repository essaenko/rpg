import { Item } from '@shared/schemas/game/item/item';
import { type } from '@colyseus/schema';
import { EquipComponent } from '@server/ecs/components/game/item/equip';
import { isEquipItemSlot } from '@shared/schemas/game/item/helpers';
import { EquipSlot } from '@shared/types';

export class EquipItem extends Item {
  constructor() {
    super();
  }
  factory = 'equip-item';
  @type('number') slot: EquipSlot;
  @type('string') effect: string = null;

  init(state: Record<string, any>): void {
    const slot = state.slot;
    if (isEquipItemSlot(slot)) {
      this.slot = slot;
    }

    //TODO Add effect init handle
  }
}
