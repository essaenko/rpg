import { MapSchema, type } from '@colyseus/schema';
import { NetworkComponent } from '@shared/ecs/component';
import { Spell } from '@shared/schemas/game/spell/spell';
import { isSpellName, map } from '@server/mechanics/spells/map';
import { COMMON_SPELLS } from '@shared/utils/const';
import { SpellSlot } from '@shared/types';
import { Gather } from '@server/mechanics/spells/common/gather';
import { Loot } from '@server/mechanics/spells/common/loot';

export class SpellBook extends NetworkComponent {
  constructor() {
    super('spell-book');
  }

  serializable = true;

  @type({ map: Spell }) spells = new MapSchema<Spell>({
    [SpellSlot.Gather.toString()]: new Gather(),
    [SpellSlot.Loot.toString()]: new Loot(),
  });

  setSpell(slot: SpellSlot, spell: Spell) {
    this.spells.set(slot.toString(), spell);
  }

  hasSpell(slot: SpellSlot, spell: Spell): boolean {
    return this.spells.get(slot.toString()) === spell;
  }

  removeSpell(slot: SpellSlot) {
    this.spells.delete(slot.toString());
  }

  init(): void {}

  public serialize() {
    return {
      name: this.name,
      spells: Array.from(this.spells.keys()),
    };
  }
}
