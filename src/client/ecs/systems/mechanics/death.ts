import { System } from '@client/core/ecs/system';
import { ECSContainer } from '@client/core/ecs';
import { WorldScene } from '@client/core/scene/world-scene';
import { Death } from '@client/ecs/components/game/mechanics/death';

export class DeathSystem extends System {
  constructor() {
    super('Death');
  }

  onUpdate(scene: WorldScene, container: ECSContainer, delta: number): void {
    for (const entity of container.query(['death'])) {
      const death = entity.get<Death>('death');

      if (!death.timer && death.dead) {
        scene.time.addEvent({
          delay: 5000,
          callback: () => {
            container.removeEntity(entity);
          },
        });
        death.timer = true;
      }
    }
  }
}
