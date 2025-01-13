import { type } from '@colyseus/schema';
import { EquipItem } from '@shared/schemas/game/item/equip-item';
import { Component } from '@shared/ecs/component';
import { Weapon } from '@shared/schemas/game/item/weapon';
import { isItemType, map } from '@shared/schemas/game/item/map';
import { MDBClient } from '@server/mongodb';

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
    Object.keys(this).forEach(async (key) => {
      if (key === 'name') {
        this.name = state.name;

        return;
      }
      if (key in state && state[key]) {
        const data = await MDBClient.instance().readItem(state[key]);

        if (!data) {
          console.warn('Cannot find item with id:', state[key]);
          return;
        }

        const factory = data.factory;

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
      head: this.head?.id ?? undefined,
      chest: this.chest?.id ?? undefined,
      shoulder: this.shoulder?.id ?? undefined,
      hand: this.hand?.id ?? undefined,
      pants: this.pants?.id ?? undefined,
      boots: this.boots?.id ?? undefined,
      mainHand: this.mainHand?.id ?? undefined,
      offHand: this.offHand?.id ?? undefined,
      ring: this.ring?.id ?? undefined,
      trinket: this.trinket?.id ?? undefined,
    };
  }
}
