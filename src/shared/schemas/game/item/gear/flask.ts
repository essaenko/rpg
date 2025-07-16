import { GearItem } from '@shared/schemas/game/item/core/gear-item';
import { FlaskSave, GearItemSave } from '@server/mongodb/types';
import { GearSlot } from '@shared/types';
import { type } from '@colyseus/schema';
import { Spell } from '@shared/schemas/game/spell/spell';
import { isSpellName, map } from '@server/mechanics/spells/map';

export class Flask extends GearItem {
  factory = 'flask';
  @type(Spell) flask: Spell = null;

  constructor() {
    super();

    this.slot = GearSlot.Flask;
  }

  init(state: FlaskSave): void {
    super.init(state);

    if (isSpellName(state.flask)) {
      this.flask = new map[state.flask]();
    }
  }
}
