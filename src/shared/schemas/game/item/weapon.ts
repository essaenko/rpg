import { EquipItem } from '@shared/schemas/game/item/equip-item';
import { type } from '@colyseus/schema';
import { WeaponHand, WeaponType } from '@shared/types';
import { WeaponSave } from '@server/mongodb/types';

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

  init(state: WeaponSave) {
    super.init(state);

    this.attackMax = state.attackMax;
    this.attackMin = state.attackMin;
    this.speed = state.speed;
    this.hand = state.hand;
    this.type = state.type;
  }

  damage(): number {
    return Math.random() * (this.attackMax - this.attackMin) + this.attackMin;
  }
}
