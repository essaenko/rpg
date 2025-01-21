import { System } from '@client/core/ecs/system';
import { ECSContainer } from '@client/core/ecs';
import { WorldScene } from '@client/core/scene/world-scene';
import { Target } from '@client/ecs/components/game/combat/target';
import { TargetHighlight } from '@client/ecs/components/game/target-highlight';
import { Position } from '@client/ecs/components/physics/position';
import { Body } from '@client/ecs/components/physics/body';
import { HealthFrame } from '@client/ecs/components/game/asset/health-frame';
import { DEFAULT_LERP_VALUE } from '@client/utils/const';

export class TargetSystem extends System {
  constructor() {
    super('target');
  }

  onUpdate(scene: WorldScene, container: ECSContainer): void {
    container.query(['target']).forEach((entity) => {
      const tComponent = entity.get<Target>('target');
      const target = container.getEntity(tComponent.target);

      if (target) {
        if (!target.has('health-frame')) {
          target.addComponent(new HealthFrame());
        }
        if (!target.has('target-highlight')) {
          target.addComponent(new TargetHighlight());
        }
      }
    });
  }
}
