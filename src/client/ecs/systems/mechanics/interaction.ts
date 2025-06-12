import { ECSContainer } from '@client/core/ecs';
import { System } from '@client/core/ecs/system';
import { WorldScene } from '@client/core/scene/world-scene';
import { TransportEventTypes } from '@shared/types';
import { InteractableObject } from '../../components/game/mechanics/interactable-object';
import { Action } from '../../components/game/mechanics/action';
import { getDistance } from '@shared/utils/physics';
import { Position } from '../../components/physics/position';
import { INTERACTION_DISTANCE } from '@shared/utils/const';
import { NetworkScene } from '@client/core/scene/network-scene';

export class InteractionSystem extends System {
  constructor() {
    super('interaction');
  }

  onUpdate(scene: WorldScene, container: ECSContainer): void {
    container.query(['interactable-object']).forEach((entity) => {
      const object = entity.get<InteractableObject>('interactable-object');
      const action = entity.getAll<Action>('action').find((action) => action.tag === 'interaction-action');

      if (!action) {
        const action = new Action();
        action.tag = 'interaction-action';
        action.action = () => {
          if (
            !object.locked &&
            getDistance(
              container.getEntity(scene.room.sessionId).get<Position>('position'),
              entity.get<Position>('position'),
            ) <= INTERACTION_DISTANCE
          ) {
            scene.room.send(TransportEventTypes.Interaction, [entity.id]);
          }
        };
        entity.add(action);
      }
    });
  }
}
