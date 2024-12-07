import { System } from '@client/core/ecs/system';
import { ECSContainer } from '@client/core/ecs';
import { WorldScene } from '@client/core/scene/world-scene';
import { TargetComponent } from '@client/ecs/components/game/combat/target';
import { TargetHighlightComponent } from '@client/ecs/components/game/target-highlight';
import { PositionComponent } from '@client/ecs/components/physics/position';
import { BodyComponent } from '@client/ecs/components/physics/body';
import { HealthFrameComponent } from '@client/ecs/components/game/asset/health-frame';

export class TargetSystem extends System {
  constructor() {
    super('target');
  }

  onUpdate(scene: WorldScene, container: ECSContainer): void {
    container.query(['target']).forEach((entity) => {
      const tComponent = entity.get<TargetComponent>('target');
      const target = container.getEntity(tComponent.target);

      if (target && !target.has('target-highlight')) {
        target.addComponent(new TargetHighlightComponent());
        target.addComponent(new HealthFrameComponent());
      }
    });

    container.query(['target-highlight']).forEach((entity) => {
      const highlight = entity.get<TargetHighlightComponent>('target-highlight');
      const position = entity.get<PositionComponent>('position');
      const body = entity.get<BodyComponent>('body');

      const originX = position.x;
      const originY = position.y + body.height * 0.4;

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
          g.strokeEllipse(0, 0, body.width * 0.6, body.height * 0.3);
          highlight.rect = g;
        }

        highlight.rect.x = Phaser.Math.Linear(highlight.rect.x, originX, 0.2);
        highlight.rect.y = Phaser.Math.Linear(highlight.rect.y, originY, 0.2);
      }
    });
  }
}
