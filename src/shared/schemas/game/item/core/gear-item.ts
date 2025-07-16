import { Item } from '@shared/schemas/game/item/core/item';
import { type } from '@colyseus/schema';
import type { GearSlot } from '@shared/types';
import type { GearItemSave } from '@server/mongodb/types';
import { MainStats } from '@shared/schemas/game/stats/stats';

export class GearItem extends Item {
  constructor() {
    super();
  }
  factory = 'gear-item';
  @type('number') slot: GearSlot;
  @type('string') effect: string = null;
  @type(MainStats) stats: MainStats = null;

  init(state: GearItemSave): void {
    super.init(state);

    this.slot = state.slot;
    this.effect = state.effect;
    this.stats = new MainStats(state.stats);
  }

  validateSave(save: unknown): save is GearItemSave {
    return super.validateSave(save);
  }

  serialize() {
    return {
      id: this.id,
    };
  }
}
