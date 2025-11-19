import { GearItem } from '@shared/schemas/game/item/core/gear-item';
import { NetworkComponent } from '@shared/ecs/component';
import { Weapon } from '@shared/schemas/game/item/weapon/weapon';
import { ItemFactory } from '@shared/schemas/game/item/map';
import { MDBClient } from '@server/mongodb';
import { type } from '@colyseus/schema';
import { Head } from '@shared/schemas/game/item/gear/head';
import { Chest } from '@shared/schemas/game/item/gear/chest';
import { Shoulder } from '@shared/schemas/game/item/gear/shoulder';
import { Boots } from '@shared/schemas/game/item/gear/boots';
import { Ring } from '@shared/schemas/game/item/gear/ring';
import { Trinket } from '@shared/schemas/game/item/gear/trinket';
import { Food } from '@shared/schemas/game/item/gear/food';
import { Flask } from '@shared/schemas/game/item/gear/flask';
import { CharacterGearSave, isChest, isWeapon } from '@server/mongodb/types';

const GEAR_SLOTS = [
  'head',
  'chest',
  'shoulder',
  'boots',
  'mainHand',
  'offHand',
  'ring',
  'trinket',
  'food',
  'flask',
] as const;

export class Gear extends NetworkComponent {
  constructor() {
    super('gear');
  }

  serializable = true;

  dirty = true;
  processed = false;

  @type(GearItem) public head: Head = null;
  @type(GearItem) public chest: Chest = null;
  @type(GearItem) public shoulder: Shoulder = null;
  @type(GearItem) public boots: Boots = null;
  @type(GearItem) public mainHand: Weapon = null;
  @type(GearItem) public offHand: Weapon = null;
  @type(GearItem) public ring: Ring = null;
  @type(GearItem) public trinket: Trinket = null;
  @type(GearItem) public food: Food = null;
  @type(GearItem) public flask: Flask = null;

  init(state: CharacterGearSave): void {
    GEAR_SLOTS.forEach(async (key) => {
      if (state[key]) {
        const data = await MDBClient.instance().readItem(state[key].id);

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
      head: this.head?.serialize() ?? undefined,
      chest: this.chest?.serialize() ?? undefined,
      shoulder: this.shoulder?.serialize() ?? undefined,
      boots: this.boots?.serialize() ?? undefined,
      mainHand: this.mainHand?.serialize() ?? undefined,
      offHand: this.offHand?.serialize() ?? undefined,
      ring: this.ring?.serialize() ?? undefined,
      trinket: this.trinket?.serialize() ?? undefined,
      flask: this.flask?.serialize() ?? undefined,
      food: this.food?.serialize() ?? undefined,
    };
  }
}
