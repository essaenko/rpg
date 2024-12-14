import { type } from '@colyseus/schema';
import { EquipItem } from '@shared/schemas/game/item/equip-item';
import { Component } from '@shared/ecs/component';
import { Weapon } from '@shared/schemas/game/item/weapon';
import { isItemType, map } from '@shared/schemas/game/item/map';

export class Equip extends Component {
  constructor() {
    super('equip');
  }

  serializable = true;

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
    Object.keys(this).forEach((key) => {
      if (key in state && state[key]) {
        const factory = state[key].factory;
        if (isItemType(factory)) {
          const Factory = map[factory];

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

  serialize(): Record<string, any> {
    return {
      name: this.name,
      head: { ...this.head },
      chest: { ...this.chest },
      shoulder: { ...this.shoulder },
      hand: { ...this.hand },
      pants: { ...this.pants },
      boots: { ...this.boots },
      mainHand: { ...this.mainHand },
      offHand: { ...this.offHand },
      ring: { ...this.ring },
      trinket: { ...this.trinket },
    };
  }
}
