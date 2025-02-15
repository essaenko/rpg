import { Scene } from '@server/core/scene/scene';
import { ECSContainer } from '@shared/ecs';
import { System } from '@shared/ecs/system';
import { TransportEventTypes } from '@shared/types';
import { Client } from 'colyseus';
import { Position } from '../../components/physics/position';
import { MapObject } from '../../components/game/tag/mapObject';

export class GameObjectsSystem extends System {
  handleMessage(client: Client, type: TransportEventTypes, message: any, container: ECSContainer): void {
    if (type === TransportEventTypes.GetObjects) {
      const objects = container.query(['tag-object', 'interactable-object']).map((obj) => {
        const position = obj.get<Position>('position');
        const data = obj.get<MapObject>('tag-object');

        return {
          x: position.x,
          y: position.y,
          id: obj.id,
          type: data.type,
          gid: data.gid,
        };
      });

      client.send(TransportEventTypes.ObjectsState, Array.from(objects));
    }
  }
  onUpdate(delta: number, container: ECSContainer, scene: Scene): void {}
  constructor() {
    super('game-objects');
  }
}
