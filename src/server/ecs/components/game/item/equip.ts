import { type } from '@colyseus/schema';
import { EquipItem } from '@shared/schemas/game/item/equip-item';
import { Component } from '@shared/ecs/component';
import { Weapon } from '@shared/schemas/game/item/weapon';
import { ItemFactory } from '@shared/schemas/game/item/map';
import { MDBClient } from '@server/mongodb';

export class Equip extends Component {
  constructor() {
    super('equip');
  }

  serializable = true;

  /* @type(EquipItem) */ public head: EquipItem = null;
  /* @type(EquipItem) */ public chest: EquipItem = null;
  /* @type(EquipItem) */ public shoulder: EquipItem = null;
  /* @type(EquipItem) */ public hand: EquipItem = null;
  /* @type(EquipItem) */ public pants: EquipItem = null;
  /* @type(EquipItem) */ public boots: EquipItem = null;
  /* @type(EquipItem) */ public mainHand: Weapon = null;
  /* @type(EquipItem) */ public offHand: Weapon = null;
  /* @type(EquipItem) */ public ring: EquipItem = null;
  /* @type(EquipItem) */ public trinket: EquipItem = null;

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

        if (key in this) {
          const item = ItemFactory.instantiate(data);
          // @ts-ignore
          this[key] = item;
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
