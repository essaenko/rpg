import { Scene } from '@server/core/scene/scene';
import { ECSContainer } from '@shared/ecs';
import { System } from '@shared/ecs/system';
import { TransportEventTypes } from '@shared/types';
import { Client } from 'colyseus';
import { Position } from '../../components/physics/position';
import { getDistance } from '@shared/utils/physics';
import { AREA_OF_INTEREST_DISTANCE } from '@shared/utils/const';
import { ClientsService } from '@shared/ecs/service/clients';
import { NetworkEntity } from '@shared/ecs/entity';
import { StateView } from '@colyseus/schema';

export class AreaOfInterestsSystem extends System {
  constructor() {
    super('area-of-interests');
  }

  handleMessage(client: Client, type: TransportEventTypes, message: any, container: ECSContainer): void {
    return;
  }
  onUpdate(delta: number, container: ECSContainer, scene: Scene): void {
    const clients = container.getService<ClientsService>('clients');
    container.query(['tag-player']).forEach((player) => {
      if (player instanceof NetworkEntity) {
        const client = clients.get(player.id);
        const entities = container
          .query(player, AREA_OF_INTEREST_DISTANCE, ['position', 'body'])
          .filter((it) => it instanceof NetworkEntity)
          .toArray();

        client.view.clear();
        for (const it of entities) {
          if (!client.view.has(it._schema)) {
            client.view.add(it._schema);
          }
        }
      }
    });
  }
}
