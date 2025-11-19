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
    for (const entity of container.query(['secondary-stats', 'level', 'class', 'gear'])) {
      const stats = entity.get<Stats>('secondary-stats');
      const cl = entity.get<Class>('class');
      const lvl = entity.get<Level>('level');
      const gear = entity.get<Gear>('gear');
      const mainStats = entity.get<import('@server/ecs/components/game/stats/main-stats').MainStats>('main-stats');

      if (!stats || !cl || !lvl || !gear) {
        continue;
      }

      const needsUpdate =
        gear.dirty || stats.dirty || stats.appliedLevel !== lvl.level || !stats.inited || mainStats?.dirty;

      if (!needsUpdate) {
        continue;
      }

      const recalculated = calculateSecondaryStats(cl.class, lvl.level, gear);

      stats.attackPower = recalculated.attackPower;
      stats.spellPower = recalculated.spellPower;
      stats.crit = recalculated.crit;
      stats.armor = recalculated.armor;
      stats.resistance = recalculated.resistance;
      stats.parry = recalculated.parry;
      stats.dodge = recalculated.dodge;
      stats.block = recalculated.block;
      stats.speed = recalculated.speed;
      stats.appliedLevel = lvl.level;
      stats.dirty = false;
      stats.inited = true;
      gear.dirty = false;
    }
  }
}
