import { GearItem } from '@shared/schemas/game/item/core/gear-item';
import { type } from '@colyseus/schema';
import type { WeaponHand, WeaponType } from '@shared/types';
import type { WeaponSave } from '@server/mongodb/types';

export class Weapon extends GearItem {
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

  validateSave(save: unknown): save is WeaponSave {
    return super.validateSave(save);
  }

  damage(): number {
    return Math.random() * (this.attackMax - this.attackMin) + this.attackMin;
  }
}
