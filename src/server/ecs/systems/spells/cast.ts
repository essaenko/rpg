import { System } from '@shared/ecs/system';
import { Client } from '@colyseus/core';
import { TransportEventTypes } from '@shared/types';
import { ECSContainer } from '@shared/ecs';
import { Scene } from '@server/core/scene/scene';
import { Cast } from '@server/ecs/components/game/spell/cast';
import { Combat } from '@server/ecs/components/game/mechanics/combat';

export class CastSystem extends System {
  constructor() {
    super('cast');
  }

  handleMessage(client: Client, type: TransportEventTypes, message: any): void {}

  onUpdate(delta: number, container: ECSContainer, scene: Scene): void {
    container.query(['cast']).forEach((entity) => {
      const cast = entity.get<Cast>('cast');
      const entityCombats = entity.getAll<Combat>('combat');
      const targetCombats = cast.target.getAll<Combat>('combat');

      if (!entityCombats?.some(({ enemy }) => enemy === cast.target)) {
        const eCombat = new Combat();
        eCombat.enemy = cast.target;
        entity.addComponent(eCombat);
      }

      if (!targetCombats?.some(({ enemy }) => enemy === entity)) {
        const tCombat = new Combat();
        tCombat.enemy = entity;
        cast.target.addComponent(tCombat);
      }

      cast.spell.cast(entity, cast.target);
      cast.spell.proc(entity, cast.target);
      cast.spell.cooldownTime = cast.spell.cooldown;
      entity.removeComponent('cast');
    });
  }
}
