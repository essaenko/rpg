import { System } from '@shared/ecs/system';
import { Client } from '@colyseus/core';
import { TransportEventTypes } from '@shared/types';
import { ECSContainer } from '@shared/ecs';
import { Scene } from '@server/core/scene/scene';
import { Level } from '@server/ecs/components/game/progression/level';
import { KillReward } from '@server/ecs/components/game/progression/kill-reward';
import { MainStats } from '@server/ecs/components/game/stats/main-stats';
import { SecondaryStats } from '@server/ecs/components/game/stats/secondary-stats';
import { Health } from '@server/ecs/components/game/stats/health/health';
import { Resource } from '@server/ecs/components/game/stats/resource/resource';
import { NetworkEntity } from '@shared/ecs/entity';

export class LevelSystem extends System {
  constructor() {
    super('level');
  }
  handleMessage(client: Client, type: TransportEventTypes, message: any, container: ECSContainer): void {}

  onUpdate(delta: number, container: ECSContainer, scene: Scene): void {
    for (const entity of container.query(['level'])) {
      const level = entity.get<Level>('level');
      const reward = entity.get<KillReward>('kill-reward');

      if (!reward) {
        continue;
      }

      if (reward.amount <= 0) {
        entity.remove(reward);
        continue;
      }

      const previousLevel = level.level;
      level.addExp(reward.amount);
      entity.remove(reward);

      if (level.level > previousLevel) {
        this.handleLevelUp(entity);
      }
    }
  }

  private handleLevelUp(entity: import('@shared/ecs/entity').Entity) {
    const mainStats = entity.get<MainStats>('main-stats');
    const secondaryStats = entity.get<SecondaryStats>('secondary-stats');
    const health = entity.get<Health>('health');
    const resource = entity.get<Resource>('resource');

    if (mainStats) {
      mainStats.dirty = true;
    }

    if (secondaryStats) {
      secondaryStats.dirty = true;
    }

    if (health) {
      health.current = health.max;
    }

    if (resource) {
      resource.current = resource.max;
    }

    if (entity instanceof NetworkEntity && entity._client) {
      entity._client.send('level-up', {
        level: entity.get<Level>('level').level,
      });
    }
  }
}
