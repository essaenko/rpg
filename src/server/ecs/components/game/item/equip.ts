import { type } from '@colyseus/schema';
import { EquipItem } from '@shared/schemas/game/item/equip-item';
import { Component } from '@shared/ecs/component';
import { Weapon } from '@shared/schemas/game/item/weapon';
import { isItemType, map } from '@shared/schemas/game/item/map';

export class EquipComponent extends Component {
  constructor() {
    super('equip');
  }

  @type(EquipItem) head: EquipItem;
  @type(EquipItem) chest: EquipItem;
  @type(EquipItem) shoulder: EquipItem;
  @type(EquipItem) hand: EquipItem;
  @type(EquipItem) pants: EquipItem;
  @type(EquipItem) boots: EquipItem;
  @type(EquipItem) mainHand: Weapon;
  @type(EquipItem) offHand: Weapon;
  @type(EquipItem) ring: EquipItem;
  @type(EquipItem) trinket: EquipItem;

  init(state: any): void {
    const a = Object.keys(this);
    Object.keys(this).forEach((key) => {
      if (key in state) {
        const type = state.type;
        if (isItemType(type)) {
          const Factory = map[type];

          const item = new Factory();
          item.init(state[key]);

          if (key in this) {
            // @ts-ignore
            this[key] = item;
          }
        }
      }
    });
  }
}
