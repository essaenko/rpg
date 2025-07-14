import { System } from '@shared/ecs/system';
import { TransportEventTypes } from '@shared/types';
import { Client } from '@colyseus/core';
import { ECSContainer } from '@shared/ecs';
import { Scene } from '@server/core/scene/scene';

import { MainStats as Stats } from '@server/ecs/components/game/stats/main-stats';
import { Class } from '@server/ecs/components/game/mechanics/class';
import { Level } from '@server/ecs/components/game/progression/level';
import { calculateMainStats } from '@shared/utils/stats';

export class MainStatsSystem extends System {
  constructor() {
    super('main-stats');
  }

  handleMessage(client: Client, type: TransportEventTypes, message: any, container: ECSContainer) {}

  onUpdate(delta: number, container: ECSContainer, scene: Scene) {
    for (const it of container.query(['main-stats', 'level', 'class'])) {
      const stats = it.get<Stats>('main-stats');
      const cl = it.get<Class>('class');
      const lvl = it.get<Level>('level');

      if (!stats.inited && cl && lvl) {
        stats.init(calculateMainStats(cl.class, lvl.level));
        stats.inited = true;
      }
    }
  }
}
