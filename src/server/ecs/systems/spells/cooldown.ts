import { System } from '@shared/ecs/system';
import { ECSContainer } from '@shared/ecs';
import { Scene } from '@server/core/scene/scene';
import { Client } from '@colyseus/core';
import { TransportEventTypes } from '@shared/types';
import { SpellBook } from '@server/ecs/components/game/spell/spell-book';

export class CooldownSystem extends System {
  constructor() {
    super('cooldown');
  }

  onUpdate(delta: number, container: ECSContainer, scene: Scene) {
    container.query(['spell-book']).forEach((entity) => {
      const spells = entity.get<SpellBook>('spell-book');

      spells?.spells.forEach((spell) => {
        if (spell.cooldownTime) {
          if (spell.cooldownTime - delta <= 0) {
            spell.cooldownTime = null;
          } else {
            spell.cooldownTime = spell.cooldownTime - delta;
          }
        }
      });
    });
  }

  handleMessage(client: Client, type: TransportEventTypes, message: any, container: ECSContainer): void {}
}
