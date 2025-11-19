import { MapSchema, Schema, type } from '@colyseus/schema';
import { NetworkComponent } from '@shared/ecs/component';
import { Spell } from '@shared/schemas/game/spell/spell';
import { SpellSlot } from '@shared/types';
import { Gather } from '@server/mechanics/spells/common/gather';
import { Loot } from '@server/mechanics/spells/common/loot';
import { Spells } from '@shared/utils/spells';
import { GearSpellList } from '@shared/schemas/game/item/core/gear-spell-list';
import { SpellsService } from '@server/mechanics/spells/map';
import { GearSpellTier, GearSpellTierType } from '@shared/utils/gear';

class GearItemSpell extends Schema {
  @type({ map: Spell }) spells: MapSchema<Spell, GearSpellTierType> = new MapSchema();
  @type(Spell) selected: Spell = null;

  constructor(spell?: Spell) {
    super();

    if (spell) {
      this.spells.set(GearSpellTier.Tier1, spell);
      this.selected = spell;
    }
  }

  init(spell: GearSpellList) {
    for (const [tier, spID] of spell.spells.entries()) {
      this.spells.set(tier, SpellsService.instance.createSpell(spID));
    }

    this.selected = SpellsService.instance.createSpell(spell.selected);
  }
}

export class SpellBook extends NetworkComponent {
  constructor() {
    super('spell-book');
  }

  serializable = true;

  @type({ map: GearItemSpell }) spells = new MapSchema<GearItemSpell>({
    [SpellSlot.Gather]: new GearItemSpell(new Gather()),
    [SpellSlot.Loot]: new GearItemSpell(new Loot()),
  });

  setSpell(slot: SpellSlot, spell: Spells | GearSpellList) {
    if (typeof spell === 'number') {
      this.spells.set(slot, new GearItemSpell(SpellsService.instance.createSpell(spell)));
    } else {
      const item = new GearItemSpell();
      this.spells.set(slot, item);
      item.init(spell);
    }
  }

  hasSpell(slot: SpellSlot, spell: Spells | GearSpellList): boolean {
    const item = this.spells.get(slot);

    return item?.selected?.id === spell;
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
