import { System } from '@shared/ecs/system';
import { Client } from '@colyseus/core';
import { TransportEventTypes } from '@shared/types';
import { ECSContainer } from '@shared/ecs';
import { Scene } from '@server/core/scene/scene';
import { HealthComponent } from '@server/ecs/components/game/stats/health/health';
import { ChangeHealthComponent } from '@server/ecs/components/game/stats/health/change-health';

export class HealthSystem extends System {
  constructor() {
    super('health');
  }

  handleMessage(client: Client, type: TransportEventTypes, message: any, container: ECSContainer): void {}

  onUpdate(delta: number, container: ECSContainer, scene: Scene): void {
    container.query(['health', 'change-health']).forEach((entity) => {
      const health = entity.get<HealthComponent>('health');
      const change = entity.get<ChangeHealthComponent>('change-health');

      health.current += change.value;
      if (health.current <= 0) {
        container.removeEntity(entity.id);
      }
      entity.removeComponent('change-health');
    });
  }
}
