import { Scene } from '@server/core/scene/scene';
import { Combat } from '@server/ecs/components/game/mechanics/combat';
import { Death } from '@server/ecs/components/game/mechanics/death';
import { Health } from '@server/ecs/components/game/stats/health/health';
import { ECSContainer } from '@shared/ecs';
import { System } from '@shared/ecs/system';
import { TransportEventTypes } from '@shared/types';
import { Client } from 'colyseus';
import { Position } from '@server/ecs/components/physics/position';
import { Spawn } from '@server/ecs/components/game/mechanics/spawn';
import { DEAD_DOLL_DESPAWN_TIMEOUT } from '@server/utils/game/const';
import { ExperienceReward } from '@server/ecs/components/game/progression/experience-reward';
import { Level } from '@server/ecs/components/game/progression/level';
import { getAdjustedKillExp, getBaseKillExp } from '@shared/utils/level';
import { KillReward } from '@server/ecs/components/game/progression/kill-reward';

export class ResurrectionSystem extends System {
  constructor() {
    super('resurrection');
  }
  handleMessage(client: Client, type: TransportEventTypes, message: any, container: ECSContainer): void {
    if (type === TransportEventTypes.Resurrect) {
      const e = container.getEntity(client.sessionId);

      if (e) {
        const death = e.get<Death>('death');
        const pos = e.get<Position>('position');
        const spawn = e.get<Spawn>('spawn');
        const health = e.get<Health>('health');

        if (death.dead && pos && spawn && health) {
          death.dead = false;
          death.despawn = false;

          health.current = health.max;
          pos.x = spawn.point.x;
          pos.y = spawn.point.y;
        }
      }
    }
  }
  onUpdate(delta: number, container: ECSContainer, scene: Scene): void {
    container.query(['health', 'death']).forEach((entity) => {
      const health = entity.get<Health>('health');
      const death = entity.get<Death>('death');

      if (health.current === 0 && death.dead === false) {
        this.grantExperience(entity, container);
        death.dead = true;
        scene.clock.setTimeout(() => {
          death.despawn = true;
        }, DEAD_DOLL_DESPAWN_TIMEOUT);
        entity.getAll<Combat>('combat')?.forEach(({ enemy }) => {
          const combat = enemy.getAll<Combat>('combat').find(({ enemy }) => enemy === entity);

          if (combat) {
            enemy.remove(combat);
          }
        });
        entity.remove('combat');

        if (entity.has('tag-npc')) {
          scene.clock.setTimeout(() => {
            health.current = health.max;
            death.dead = false;
            death.despawn = false;
          }, 30_000);
        }
      }
    });
  }

  private grantExperience(entity: import('@shared/ecs/entity').Entity, container: ECSContainer) {
    if (!entity.has('tag-npc')) {
      return;
    }

    const victimLevel = entity.get<Level>('level')?.level ?? 1;
    const reward = entity.get<ExperienceReward>('experience-reward');
    const baseExp = getBaseKillExp(victimLevel, reward?.baseExp);
    const difficulty = reward?.difficultyMultiplier ?? 1;
    const totalBaseExp = Math.round(baseExp * difficulty);

    if (totalBaseExp <= 0) {
      return;
    }

    const participants = entity
      .getAll<Combat>('combat')
      ?.map(({ enemy }) => enemy)
      .filter(
        (participant) =>
          participant &&
          participant.has('tag-player') &&
          !participant.get<Death>('death')?.dead &&
          participant.id !== entity.id,
      );

    if (!participants?.length) {
      return;
    }

    for (const participant of participants) {
      const participantLevel = participant.get<Level>('level')?.level ?? 1;
      const amount = getAdjustedKillExp(totalBaseExp, participantLevel, victimLevel);

      if (amount <= 0) {
        continue;
      }

      let existing = participant.get<KillReward>('kill-reward');

      if (!existing) {
        existing = new KillReward();
        participant.add(existing);
      }

      existing.amount += amount;
      existing.victimId = entity.id;
      existing.victimLevel = victimLevel;
    }
  }
}
