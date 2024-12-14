import { System } from '@client/core/ecs/system';
import { ECSContainer } from '@client/core/ecs';
import { WorldScene } from '@client/core/scene/world-scene';
import { Target } from '@client/ecs/components/game/combat/target';
import { TargetHighlight } from '@client/ecs/components/game/target-highlight';
import { Position } from '@client/ecs/components/physics/position';
import { Body } from '@client/ecs/components/physics/body';
import { HealthFrame } from '@client/ecs/components/game/asset/health-frame';

export class TargetSystem extends System {
  constructor() {
    super('target');
  }

  onUpdate(scene: WorldScene, container: ECSContainer): void {
    container.query(['target']).forEach((entity) => {
      const tComponent = entity.get<Target>('target');
      const target = container.getEntity(tComponent.target);

      if (target && !target.has('target-highlight')) {
        target.addComponent(new TargetHighlight());
        target.addComponent(new HealthFrame());
      }
    });

    container.query(['target-highlight']).forEach((entity) => {
      const highlight = entity.get<TargetHighlight>('target-highlight');
      const position = entity.get<Position>('position');
      const body = entity.get<Body>('body');

      const originX = position.x;
      const originY = position.y + body.height * 0.6;

      if (body && position) {
        if (!highlight.rect) {
          const g = scene.add.graphics({
            x: 0,
            y: 0,
            lineStyle: {
              width: 1,
              color: 0xffd600,
              alpha: 1,
            },
          });
          g.x = originX;
          g.y = originY;
          g.strokeEllipse(0, 0, body.width * 1.1, body.height * 0.3);
          highlight.rect = g;
        }

        highlight.rect.x = Phaser.Math.Linear(highlight.rect.x, originX, 0.2);
        highlight.rect.y = Phaser.Math.Linear(highlight.rect.y, originY, 0.2);
      }
    });
  }
}
