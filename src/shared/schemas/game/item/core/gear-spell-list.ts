import { MapSchema, Schema, type } from '@colyseus/schema';
import { Spell } from '@shared/schemas/game/spell/spell';

export class GearSpellList extends Schema {
  constructor() {
    super();
  }

  @type({ map: Spell }) spells: MapSchema<Spell> = new MapSchema();
  @type(Spell) selected: Spell;
}
