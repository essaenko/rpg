import { System } from '@shared/ecs/system';
import { TransportEventTypes } from '@shared/types';
import { Client } from '@colyseus/core';
import { ECSContainer } from '@shared/ecs';
import { Scene } from '@server/core/scene/scene';

import { SecondaryStats as Stats } from '@server/ecs/components/game/stats/secondary-stats';
import { Class } from '@server/ecs/components/game/mechanics/class';
import { Level } from '@server/ecs/components/game/progression/level';
import { calculateSecondaryStats } from '@shared/utils/stats';
import { Gear } from '@server/ecs/components/game/item/gear';

export class SecondaryStatsSystem extends System {
  constructor() {
    super('secondary-stats');
  }

  handleMessage(client: Client, type: TransportEventTypes, message: any, container: ECSContainer) {}

  onUpdate(delta: number, container: ECSContainer, scene: Scene) {
    for (const it of container
      .query(['secondary-stats', 'level', 'class', 'gear'])
      .filter((it) => it.get<Gear>('gear').dirty)) {
      const stats = it.get<Stats>('secondary-stats');
      const cl = it.get<Class>('class');
      const lvl = it.get<Level>('level');
      const gear = it.get<Gear>('gear');

      if (!stats.inited && cl && lvl) {
        stats.init(calculateSecondaryStats(cl.class, lvl.level, gear));
        stats.inited = true;
      }
    }
  }
}
