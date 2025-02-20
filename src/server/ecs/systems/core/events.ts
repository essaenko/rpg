import { Scene } from '@server/core/scene/scene';
import { EventComponent } from '@server/ecs/components/trigger/events/event';
import { ECSContainer } from '@shared/ecs';
import { System } from '@shared/ecs/system';
import { TransportEventTypes } from '@shared/types';
import { Client } from 'colyseus';

export class EventSystem extends System {
  handleMessage(client: Client, type: TransportEventTypes, message: any, container: ECSContainer): void {
    //
  }
  onUpdate(delta: number, container: ECSContainer, scene: Scene): void {
    for (const entity of container.query(['event'])) {
      const event = entity.get<EventComponent>('event');
      if (event.processed) {
        entity.remove(event);
      } else {
        event.processed = true;
      }
    }
  }
  constructor() {
    super('event');
  }
}
