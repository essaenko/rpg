import { GearItem } from '@shared/schemas/game/item/core/gear-item';
import type { FlaskSave } from '@server/mongodb/types';
import { GearSlot } from '@shared/types';
import { type } from '@colyseus/schema';
import { Spells } from '@shared/utils/spells';

export class Flask extends GearItem {
  factory = 'flask';
  @type('number') flask: Spells = null;

  constructor() {
    super();

    this.slot = GearSlot.Flask;
  }

  init(state: FlaskSave): void {
    super.init(state);

    this.flask = +state.flask;
  }
}
