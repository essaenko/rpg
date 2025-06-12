import { MapSchema, type } from '@colyseus/schema';
import { NetworkComponent } from '@shared/ecs/component';
import { Spell } from '@shared/schemas/game/spell/spell';
import { isSpellName, map } from '@server/mechanics/spells/map';
import { COMMON_SPELLS } from '@shared/utils/const';

export class SpellBook extends NetworkComponent {
  constructor() {
    super('spell-book');
  }

  serializable = true;

  @type({ map: Spell }) spells = new MapSchema<Spell>();

  init(state: { spells: number[] }): void {
    const { spells } = state;

    if (spells && Array.isArray(spells)) {
      [...spells, ...COMMON_SPELLS].forEach((spell) => {
        if (isSpellName(spell)) {
          const Factory = map[spell];
          this.spells.set(spell.toString(), new Factory());
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
