import { collide, getCollider } from '@server/core/helpers/map';
import { Scene } from '@server/core/scene/scene';
import { Trigger } from '@server/ecs/components/trigger/trigger';
import { ECSContainer } from '@shared/ecs';
import { System } from '@shared/ecs/system';
import { TransportEventTypes } from '@shared/types';
import { Client } from 'colyseus';

export class TriggerSystem extends System {
  constructor() {
    super('trigger');
  }

  handleMessage(client: Client, type: TransportEventTypes, message: any, container: ECSContainer): void {
    // throw new Error('Method not implemented.');
  }
  onUpdate(delta: number, container: ECSContainer, scene: Scene): void {
    for (const obj of container.query(['trigger'])) {
      const trigger = obj.get<Trigger>('trigger');
      for (const entity of container.query(['body', 'position'], ['tag-object', 'trigger'])) {
        if (trigger.validate(entity)) {
          if (collide(getCollider(obj), getCollider(entity))) {
            if (!trigger.cache.has(entity)) {
              trigger.activate(entity, container, scene);
              trigger.cache.add(entity);
            }
          } else if (trigger.cache.has(entity)) {
            trigger.cache.delete(entity);
          }
        }
      }
    }
  }
}
