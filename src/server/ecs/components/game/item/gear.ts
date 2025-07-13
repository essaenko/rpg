import { GearItem } from '@shared/schemas/game/item/gear-item';
import { Component } from '@shared/ecs/component';
import { Weapon } from '@shared/schemas/game/item/weapon';
import { ItemFactory } from '@shared/schemas/game/item/map';
import { MDBClient } from '@server/mongodb';

export class Gear extends Component {
  constructor() {
    super('gear');
  }

  serializable = true;

  /* @type(GearItem) */ public head: GearItem = null;
  /* @type(GearItem) */ public chest: GearItem = null;
  /* @type(GearItem) */ public shoulder: GearItem = null;
  /* @type(GearItem) */ public boots: GearItem = null;
  /* @type(GearItem) */ public mainHand: Weapon = null;
  /* @type(GearItem) */ public offHand: Weapon = null;
  /* @type(GearItem) */ public ring: GearItem = null;
  /* @type(GearItem) */ public trinket: GearItem = null;

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
          // @ts-ignore
          this[key] = ItemFactory.instantiate(data);
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
      boots: this.boots?.id ?? undefined,
      mainHand: this.mainHand?.id ?? undefined,
      offHand: this.offHand?.id ?? undefined,
      ring: this.ring?.id ?? undefined,
      trinket: this.trinket?.id ?? undefined,
    };
  }
}
