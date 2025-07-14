import { System } from '@shared/ecs/system';
import { Client } from '@colyseus/core';
import { TransportEventTypes } from '@shared/types';
import { ECSContainer } from '@shared/ecs';
import { Scene } from '@server/core/scene/scene';
import { Health } from '@server/ecs/components/game/stats/health/health';
import { ChangeHealth } from '@server/ecs/components/game/stats/health/change-health';
import { MainStats } from '@server/ecs/components/game/stats/main-stats';

export class HealthSystem extends System {
  constructor() {
    super('health');
  }

  handleMessage(client: Client, type: TransportEventTypes, message: any, container: ECSContainer): void {}

  onUpdate(delta: number, container: ECSContainer, scene: Scene): void {
    for (const it of container.query(['main-stats', 'health'])) {
      const stats = it.get<MainStats>('main-stats');
      const health = it.get<Health>('health');

      health.max = 100 + stats.stamina * 10 + stats.strength * 2;

      let hpRegen = 1 + (stats.stamina * 0.1 + stats.strength * 0.02) * delta;

      if (it.has('combat')) {
        hpRegen = hpRegen / 10;
      }

      health.current = Math.min(health.max, health.current + hpRegen);
    }

    for (const it of container.query(['health', 'change-health'])) {
      const health = it.get<Health>('health');
      const change = it.get<ChangeHealth>('change-health');

      health.current = Math.min(health.max, Math.max(0, health.current + change.value));

      it.remove('change-health');
    }
  }
}
