import { MapSchema, type } from '@colyseus/schema';
import { NetworkComponent } from '@shared/ecs/component';
import { Spell } from '@shared/schemas/game/spell/spell';
import { SpellSlot } from '@shared/types';
import { Gather } from '@server/mechanics/spells/common/gather';
import { Loot } from '@server/mechanics/spells/common/loot';
import { Spells } from '@shared/utils/spells';
import { SpellsService } from '@server/mechanics/spells/map';

export class SpellBook extends NetworkComponent {
  constructor() {
    super('spell-book');
  }

  serializable = true;

  @type({ map: Spell }) spells = new MapSchema<Spell>({
    [SpellSlot.Gather]: new Gather(),
    [SpellSlot.Loot]: new Loot(),
  });

  setSpell(slot: SpellSlot, spell: Spells) {
    const existing = this.spells.get(slot);

    if (existing?.id === spell) {
      return;
    }

    this.spells.set(slot, SpellsService.instance.createSpell(spell));
  }

  hasSpell(slot: SpellSlot, spell: Spells): boolean {
    return this.spells.get(slot)?.id === spell;
  }

  removeSpell(slot: SpellSlot) {
    if (this.spells.has(slot)) {
      this.spells.delete(slot);
    }
  }

  init(): void {}

  public serialize() {
    return {
      name: this.name,
    };
  }
}
