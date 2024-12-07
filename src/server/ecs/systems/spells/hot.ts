import { System } from '@shared/ecs/system';
import { Client } from '@colyseus/core';
import { TransportEventTypes } from '@shared/types';
import { ECSContainer } from '@shared/ecs';
import { Scene } from '@server/core/scene/scene';
import { HotComponent } from '@server/ecs/components/game/spells/hot';
import { HealComponent } from '@server/ecs/components/game/spells/heal';

export class HotSystem extends System {
  constructor() {
    super('hot');
  }

  handleMessage(client: Client, type: TransportEventTypes, message: any, container: ECSContainer): void {}

  onUpdate(delta: number, container: ECSContainer, scene: Scene): void {
    container.query(['hot']).forEach((entity) => {
      const hot = entity.get<HotComponent>('hot');
      hot.nextTick = Math.max(0, hot.nextTick - delta);

      if (hot.nextTick === 0) {
        hot.nextTick = hot.interval;

        const heal = new HealComponent();
        heal.value = hot.amount;

        entity.addComponent(heal);
      }

      hot.duration = Math.max(0, hot.duration - delta);
      if (hot.duration === 0) {
        entity.removeComponent(hot);
      }
    });
  }
}
