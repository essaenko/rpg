import { System } from '@shared/ecs/system';
import { TransportEventTypes } from '@shared/types';
import { Client } from '@colyseus/core';
import { ECSContainer } from '@shared/ecs';
import { Scene } from '@server/core/scene/scene';

import { MainStats as Stats } from '@server/ecs/components/game/stats/main-stats';
import { Class } from '@server/ecs/components/game/mechanics/class';
import { Level } from '@server/ecs/components/game/progression/level';
import { calculateMainStats } from '@shared/utils/stats';
import { Gear } from '@server/ecs/components/game/item/gear';

export class MainStatsSystem extends System {
  constructor() {
    super('main-stats');
  }

  handleMessage(client: Client, type: TransportEventTypes, message: any, container: ECSContainer) {}

  onUpdate(delta: number, container: ECSContainer, scene: Scene) {
    for (const entity of container.query(['main-stats', 'level', 'class', 'gear'])) {
      const stats = entity.get<Stats>('main-stats');
      const cl = entity.get<Class>('class');
      const lvl = entity.get<Level>('level');
      const gear = entity.get<Gear>('gear');

      if (!stats || !cl || !lvl || !gear) {
        continue;
      }

      const needsUpdate = gear.dirty || stats.dirty || stats.appliedLevel !== lvl.level || !stats.inited;

      if (!needsUpdate) {
        continue;
      }

      const recalculated = calculateMainStats(cl.class, lvl.level, gear);

      stats.stamina = recalculated.stamina;
      stats.strength = recalculated.strength;
      stats.intellect = recalculated.intellect;
      stats.agility = recalculated.agility;
      stats.appliedLevel = lvl.level;
      stats.dirty = false;
      stats.inited = true;
      gear.dirty = false;
    }
  }
}
