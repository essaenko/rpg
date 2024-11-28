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
    const spells = state.spells;

    if (spells && Array.isArray(spells)) {
      spells.forEach((spell) => {
        if (isSpellName(spell)) {
          const Factory = map[spell];
          this.spells.set(spell, new Factory());
        }
      });
    }
  }

  public serialize() {
    return {
      name: this.name,
      spells: Array.from(this.spells.keys()),
    };
  }
}
