import { GearItem } from '@shared/schemas/game/item/core/gear-item';
import { type } from '@colyseus/schema';
import type { WeaponHand, WeaponType } from '@shared/types';
import type { WeaponSave } from '@server/mongodb/types';
import { GearSpellList } from '@shared/schemas/game/item/core/gear-spell-list';

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

  main: GearSpellList = null;
  secondary: GearSpellList = null;
  buff: GearSpellList = null;
  ultimate: GearSpellList = null;

  init(state: WeaponSave) {
    super.init(state);

    this.attackMax = state.attackMax;
    this.attackMin = state.attackMin;
    this.speed = state.speed;
    this.hand = state.hand;
    this.type = state.type;

    (['main', 'secondary', 'buff', 'ultimate'] as const).forEach((key) => {
      if (state[key]) {
        this[key] = new GearSpellList();
        this[key].init(state[key]);
      }
    });
  }

  validateSave(save: unknown): save is WeaponSave {
    return super.validateSave(save);
  }

  damage(): number {
    return Math.random() * (this.attackMax - this.attackMin) + this.attackMin;
  }

  serialize(): Pick<WeaponSave, 'id' | 'main' | 'secondary' | 'buff' | 'ultimate'> {
    return {
      ...super.serialize(),
      main: this.main?.serialize() ?? null,
      secondary: this.secondary?.serialize() ?? null,
      buff: this.buff?.serialize() ?? null,
      ultimate: this.ultimate?.serialize() ?? null,
    };
  }
}
