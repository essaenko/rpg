import { Scene } from '@server/core/scene/scene';
import { ECSContainer } from '@shared/ecs';
import { System } from '@shared/ecs/system';
import { TransportEventTypes } from '@shared/types';
import { Client } from 'colyseus';
import { Position } from '../components/physics/position';
import { getDistance } from '@shared/utils/physics';
import { AREA_OF_INTEREST_DISTANCE } from '@shared/utils/const';
import { ClientsService } from '@shared/ecs/service/clients';
import { NetworkEntity } from '@shared/ecs/entity';

export class AreaOfInterestsSystem extends System {
  constructor() {
    super('area-of-interests');
  }

  handleMessage(client: Client, type: TransportEventTypes, message: any, container: ECSContainer): void {
    return;
  }
  onUpdate(delta: number, container: ECSContainer, scene: Scene): void {
    const entitiesWithBody = Array.from(container.query(['body']).filter((it) => it instanceof NetworkEntity));
    const clients = container.getService<ClientsService>('clients');
    container.query(['tag-player']).forEach((player) => {
      const client = clients.get(player.id);
      const playerPos = player.get<Position>('position');
      entitiesWithBody.forEach((it) => {
        const pos = it.get<Position>('position');
        if (getDistance(playerPos, pos) > AREA_OF_INTEREST_DISTANCE) {
          client.view.remove(it._schema);
        } else {
          client.view.add(it._schema);
        }
      });
    });
  }
}
