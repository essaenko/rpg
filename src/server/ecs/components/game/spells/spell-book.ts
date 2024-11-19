import { MapSchema, type } from '@colyseus/schema';
import { Component } from '@shared/ecs/component';
import { Spell } from '@shared/schemas/game/spell/spell';
import { isSpellName, map } from '@server/mechanics/spells/map';

export class SpellBookComponent extends Component {
  constructor() {
    super('spell-book');
  }

  @type({ map: Spell }) spells = new MapSchema<Spell>();

  init(state: Record<string, any>): void {
    Object.keys(state).forEach((key: string) => {
      if (isSpellName(key)) {
        const Factory = map[key];
        this.spells.set(key, new Factory());
      }
    });
  }
}
