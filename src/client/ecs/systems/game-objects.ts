import { ECSContainer } from '@client/core/ecs';
import { Entity } from '@client/core/ecs/entity/entity';
import { System } from '@client/core/ecs/system';
import { NetworkScene } from '@client/core/scene/network-scene';
import { isObjectsState, TransportEventTypes } from '@shared/types';
import { InteractableObject } from '../components/game/mechanics/interactable-object';
import { MapObject } from '../components/game/tag/mapObject';
import { Position } from '../components/physics/position';

export class GameObjectsSystem extends System {
  onUpdate(scene: Phaser.Scene, container: ECSContainer, delta: number): void {}

  handleMessage(type: TransportEventTypes, message: any, container: ECSContainer, scene: NetworkScene): void {
    if (type === TransportEventTypes.ObjectsState) {
      if (isObjectsState(message)) {
        for (const obj of message) {
          const entity = new Entity(obj.id);
          entity.addComponent(new InteractableObject());

          const position = new Position();
          position.x = obj.x;
          position.y = obj.y;
          entity.addComponent(position);

          const objComp = new MapObject();
          objComp.gid = obj.gid;
          objComp.type = obj.type;
          entity.addComponent(objComp);

          container.addEntity(entity);
        }
      }
    }
  }
  constructor() {
    super('game-objects');
  }
}
