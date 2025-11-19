import { System } from '@shared/ecs/system';
import { SpellSlot, TransportEventTypes } from '@shared/types';
import { Client } from '@colyseus/core';
import { ECSContainer } from '@shared/ecs';
import { Scene } from '@server/core/scene/scene';
import { SpellBook } from '@server/ecs/components/game/spell/spell-book';
import { Class } from '@server/ecs/components/game/mechanics/class';
import { CLASS_SPELL_UNLOCKS } from '@shared/utils/spells';
import { Level } from '@server/ecs/components/game/progression/level';

const STATIC_SLOTS = new Set<SpellSlot>([SpellSlot.Gather, SpellSlot.Loot]);

export class SpellBookSystem extends System {
  constructor() {
    super('spell-book');
  }

  handleMessage(client: Client, type: TransportEventTypes, message: any, container: ECSContainer) {}

  onUpdate(delta: number, container: ECSContainer, scene: Scene) {
    for (const entity of container.query(['spell-book', 'class', 'level'])) {
      const spellBook = entity.get<SpellBook>('spell-book');
      const characterClass = entity.get<Class>('class');
      const level = entity.get<Level>('level');

      if (!spellBook || !characterClass?.class || !level) {
        continue;
      }

      const unlocks = CLASS_SPELL_UNLOCKS[characterClass.class] ?? [];
      const available = unlocks.filter((unlock) => unlock.level <= level.level);
      const desiredSlots = new Set(available.map(({ slot }) => slot));

      for (const unlock of available) {
        if (!spellBook.hasSpell(unlock.slot, unlock.spell)) {
          spellBook.setSpell(unlock.slot, unlock.spell);
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
