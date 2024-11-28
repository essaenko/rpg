import { System } from '@shared/ecs/system';
import { Client } from '@colyseus/core';
import { TransportEventTypes } from '@shared/types';
import { ECSContainer } from '@shared/ecs';
import { Scene } from '@server/core/scene/scene';
import { CastComponent } from '@server/ecs/components/game/spells/cast';

export class CastSystem extends System {
  constructor() {
    super('cast');
  }

  handleMessage(client: Client, type: TransportEventTypes, message: any): void {}

  onUpdate(delta: number, container: ECSContainer, scene: Scene): void {
    container.query(['cast']).forEach((entity) => {
      const cast = entity.get<CastComponent>('cast');

      cast.spell.cast(entity, cast.target);
      entity.removeComponent('cast');
    });
  }
}
