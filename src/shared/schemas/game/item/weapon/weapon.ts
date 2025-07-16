import { GearItem } from '@shared/schemas/game/item/core/gear-item';
import { type } from '@colyseus/schema';
import { WeaponHand, WeaponType } from '@shared/types';
import { WeaponSave } from '@server/mongodb/types';
import { isSpellName, map } from '@server/mechanics/spells/map';
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

  @type(GearSpellList) main: GearSpellList = null;
  @type(GearSpellList) secondary: GearSpellList = null;
  @type(GearSpellList) buff: GearSpellList = null;
  @type(GearSpellList) ultimate: GearSpellList = null;

  init(state: WeaponSave) {
    super.init(state);

    this.attackMax = state.attackMax;
    this.attackMin = state.attackMin;
    this.speed = state.speed;
    this.hand = state.hand;
    this.type = state.type;

    (['main', 'secondary', 'buff', 'ultimate'] as const).forEach((key) => {
      if (state[key] && state[key].length > 0) {
        this[key] = new GearSpellList();

        state[key].forEach((spellID, index) => {
          if (isSpellName(spellID)) {
            const spell = new map[spellID]();

            this[key].spells.set(`tier_${index}`, spell);
          }
        });
      }
    });
  }

  validateSave(save: unknown): save is WeaponSave {
    return super.validateSave(save);
  }

  damage(): number {
    return Math.random() * (this.attackMax - this.attackMin) + this.attackMin;
  }

  serialize() {
    return {
      ...super.serialize(),
      main: {
        selected: this.main.selected.id,
      },
      secondary: {
        selected: this.secondary.selected.id,
      },
      buff: {
        selected: this.buff.selected.id,
      },
      ultimate: {
        selected: this.ultimate.selected.id,
      },
    };
  }
}
