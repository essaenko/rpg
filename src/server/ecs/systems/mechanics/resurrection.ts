import { Scene } from '@server/core/scene/scene';
import { Combat } from '@server/ecs/components/game/mechanics/combat';
import { Death } from '@server/ecs/components/game/mechanics/death';
import { Health } from '@server/ecs/components/game/stats/health/health';
import { ECSContainer } from '@shared/ecs';
import { System } from '@shared/ecs/system';
import { TransportEventTypes } from '@shared/types';
import { Client } from 'colyseus';

export class ResurrectionSystem extends System {
  constructor() {
    super('resurrection');
  }
  handleMessage(client: Client, type: TransportEventTypes, message: any, container: ECSContainer): void {}
  onUpdate(delta: number, container: ECSContainer, scene: Scene): void {
    container.query(['health', 'death']).forEach((entity) => {
      const health = entity.get<Health>('health');
      const death = entity.get<Death>('death');

      if (health.current === 0 && death.dead === false) {
        death.dead = true;
        entity.getAll<Combat>('combat')?.forEach(({ enemy }) => {
          const combat = enemy.getAll<Combat>('combat').find(({ enemy }) => enemy === entity);

          if (combat) {
            enemy.removeComponent(combat);
          }
        });
        entity.removeComponent('combat');

        if (entity.has('tag-npc')) {
          scene.clock.setTimeout(() => {
            health.current = health.max;
            death.dead = false;
          }, 10_000);
        }
      }
    });
  }
}
