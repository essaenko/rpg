import { System } from '@shared/ecs/system';
import { SpellSlot, TransportEventTypes } from '@shared/types';
import { Client } from '@colyseus/core';
import { ECSContainer } from '@shared/ecs';
import { Scene } from '@server/core/scene/scene';
import { Gear } from '@server/ecs/components/game/item/gear';
import { SpellBook } from '@server/ecs/components/game/spell/spell-book';
import { Spell } from '@shared/schemas/game/spell/spell';

export class SpellBookSystem extends System {
  constructor() {
    super('spell-book');
  }

  handleMessage(client: Client, type: TransportEventTypes, message: any, container: ECSContainer) {}

  onUpdate(delta: number, container: ECSContainer, scene: Scene) {
    for (const it of container.query(['gear', 'spell-book']).filter((it) => it.get<Gear>('gear').dirty)) {
      const gear = it.get<Gear>('gear');
      const sb = it.get<SpellBook>('spell-book');

      if (sb && gear) {
        const { mainHand, offHand, chest, food, flask } = gear;

        const spells: [SpellSlot, Spell | void][] = [
          [SpellSlot.Main, mainHand?.main],
          [SpellSlot.Secondary, offHand?.secondary ?? mainHand?.secondary],
          [SpellSlot.Buff, offHand?.buff ?? mainHand?.buff],
          [SpellSlot.Ultimate, mainHand?.ultimate],
          [SpellSlot.Save, chest?.save],
          [SpellSlot.Dodge, chest?.dodge],
          [SpellSlot.Flask, flask?.flask],
          [SpellSlot.Food, food?.food],
        ];

        spells.forEach(([slot, spell]) => {
          if (!spell) {
            sb.removeSpell(slot);
          } else if (!sb.hasSpell(slot, spell)) {
            sb.setSpell(slot, spell);
          }
        });
      }
    }
  }
}
