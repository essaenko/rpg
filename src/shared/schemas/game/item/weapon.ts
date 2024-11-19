import { EquipItem } from '@shared/schemas/game/item/equip-item';
import { type } from '@colyseus/schema';
import { WeaponHand, WeaponType } from '@shared/types';

export class Weapon extends EquipItem {
  constructor() {
    super();
  }

  factory = 'weapon';

  @type('number') attackMin: number = 0;
  @type('number') attackMax: number = 0;
  @type('number') speed: number = 0;
  @type('number') hand: WeaponHand = null;
  @type('number') type: WeaponType = null;

  init(state: Record<string, any>) {
    super.init(state);

    Object.keys(this).forEach((key) => {
      if (key in state) {
        // @ts-ignore
        this[key] = state[key];
      }
    });
  }
}
