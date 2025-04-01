import { Entity, NetworkEntity } from '@shared/ecs/entity';
import { Trigger } from './trigger';
import { Location } from '../game/ui/location';
import { Position } from '../physics/position';
import { TransportEventTypes, type Position as PositionType } from '@shared/types';
import { MDBClient } from '@server/mongodb';
import { ECSContainer } from '@shared/ecs';
import { Scene } from '@server/core/scene/scene';

import { maps } from '@shared/maps/mapping';

export class ChangeScene extends Trigger {
  public scene: string;
  validate(entity: Entity): boolean {
    return entity.has('tag-player');
  }
  async activate(entity: Entity, container: ECSContainer, scene: Scene): Promise<void> {
    const location = entity.get<Location>('location');
    const position = entity.get<Position>('position');
    const map = maps[this.scene];
    const spawn = map?.layers.find(({ name }) => name === 'locations')?.objects?.find(({ type }) => type === 'spawn');

    if (location && position && entity instanceof NetworkEntity && spawn) {
      location.value = this.scene;
      position.x = spawn.x;
      position.y = spawn.y;

      entity._client.send(TransportEventTypes.ChangeScene, this.scene);

      container.removeEntity(entity.id);
      scene.state.entities.delete(entity._schema.id);

      entity.id = entity._client.userData?.id as string;
      await MDBClient.instance().writePlayer(entity);

      entity._client.leave();
    }
  }
  constructor() {
    super('change-scene');
  }
}
