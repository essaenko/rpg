import { System } from '@shared/ecs/system';
import { Client } from '@colyseus/core';
import { ResourceType, TransportEventTypes } from '@shared/types';
import { ECSContainer } from '@shared/ecs';
import { Scene } from '@server/core/scene/scene';
import { Health } from '@server/ecs/components/game/stats/health/health';
import { ChangeHealth } from '@server/ecs/components/game/stats/health/change-health';
import { MainStats } from '@server/ecs/components/game/stats/main-stats';
import { Resource } from '@server/ecs/components/game/stats/resource/resource';
import { ChangeResource } from '@server/ecs/components/game/stats/resource/change-resource';

export class ResourceSystem extends System {
  constructor() {
    super('health');
  }

  handleMessage(client: Client, type: TransportEventTypes, message: any, container: ECSContainer): void {}

  onUpdate(delta: number, container: ECSContainer, scene: Scene): void {
    for (const it of container.query(['main-stats', 'resource'])) {
      const stats = it.get<MainStats>('main-stats');
      const rc = it.get<Resource>('resource');

      switch (rc.type) {
        case ResourceType.Energy:
          rc.max = 150;

          rc.current = Math.min(rc.max, rc.current + 5 * delta);
          break;
        case ResourceType.Rage:
          rc.max = 100;

          if (!it.has('combat')) {
            rc.current = Math.max(0, rc.current - 5 * delta);
          }
          break;
        case ResourceType.Mana:
          rc.max = 80 + stats.intellect * 10 + stats.stamina * 2;

          let rcReg = (1 + stats.intellect * 0.25 + stats.stamina * 0.05) * delta;

          if (it.has('combat')) {
            rcReg = rcReg / 10;
          }

          rc.current = Math.min(rc.max, rc.current + rcReg);
          break;
      }
    }

    for (const it of container.query(['resource', 'change-resource'])) {
      const rc = it.get<Resource>('resource');
      const change = it.get<ChangeResource>('change-resource');

      rc.current = Math.min(rc.max, Math.max(0, rc.current + change.value));

      it.remove('change-resource');
    }
  }
}
