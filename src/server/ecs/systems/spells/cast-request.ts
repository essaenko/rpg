import { System } from '@shared/ecs/system';
import { Client } from '@colyseus/core';
import { TransportEventTypes } from '@shared/types';
import { ECSContainer } from '@shared/ecs';
import { Scene } from '@server/core/scene/scene';
import { CastRequestComponent } from '../../components/game/spells/cast-request';

export class CastRequestSystem extends System {
  constructor() {
    super('cast-request');
  }

  handleMessage(client: Client, type: TransportEventTypes, message: any, container: ECSContainer): void {
    if (type === TransportEventTypes.CastRequest) {
      const entity = container.getEntity(client.sessionId);

      if (entity) {
        entity.addComponent(new CastRequestComponent());
      }
    }
  }

  onUpdate(delta: number, container: ECSContainer, scene: Scene): void {
    container.query(['cast-request']).forEach((entity) => {});
  }
}
