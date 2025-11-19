import { System } from '@shared/ecs/system';
import { SpellSlot, TransportEventTypes } from '@shared/types';
import { Client } from '@colyseus/core';
import { ECSContainer } from '@shared/ecs';
import { Scene } from '@server/core/scene/scene';
import { SpellBook } from '@server/ecs/components/game/spell/spell-book';
import { Class } from '@server/ecs/components/game/mechanics/class';
import { CLASS_SPELLBOOK } from '@shared/utils/spells';

const STATIC_SLOTS = new Set<SpellSlot>([SpellSlot.Gather, SpellSlot.Loot]);

export class SpellBookSystem extends System {
  constructor() {
    super('spell-book');
  }

  handleMessage(client: Client, type: TransportEventTypes, message: any, container: ECSContainer) {}

  onUpdate(delta: number, container: ECSContainer, scene: Scene) {
    for (const entity of container.query(['spell-book', 'class'])) {
      const spellBook = entity.get<SpellBook>('spell-book');
      const characterClass = entity.get<Class>('class');

      if (!spellBook || !characterClass?.class) {
        continue;
      }

      const classSpells = CLASS_SPELLBOOK[characterClass.class] ?? {};
      const desiredSlots = new Set(Object.keys(classSpells) as SpellSlot[]);

      for (const [slotKey, spellId] of Object.entries(classSpells)) {
        const slot = slotKey as SpellSlot;

        if (spellId && !spellBook.hasSpell(slot, spellId)) {
          spellBook.setSpell(slot, spellId);
        }
      }

      for (const slotKey of Array.from(spellBook.spells.keys())) {
        const slot = slotKey as SpellSlot;

        if (STATIC_SLOTS.has(slot)) {
          continue;
        }

        if (!desiredSlots.has(slot)) {
          spellBook.removeSpell(slot);
        }
      }
    }
  }
}
