import { System } from '@client/core/ecs/system';
import { ECSContainer } from '@client/core/ecs';
import { WorldScene } from '@client/core/scene/world-scene';
import { TargetComponent } from '@client/ecs/components/game/combat/target';
import { TargetHighlightComponent } from '@client/ecs/components/game/target-highlight';
import { PositionComponent } from '@client/ecs/components/physics/position';
import { BodyComponent } from '@client/ecs/components/physics/body';

export class TargetSystem extends System {
  constructor() {
    super('target');
  }

  onUpdate(scene: WorldScene, container: ECSContainer): void {
    container.query(['target']).forEach((entity) => {
      const tComponent = entity.get<TargetComponent>('target');
      const target = container.getEntity(tComponent.target);

      if (target && target.has('sprite') && !target.has('target-highlight')) {
        target.addComponent(new TargetHighlightComponent());
      }
    });

    container.query(['target-highlight']).forEach((entity) => {
      const highlight = entity.get<TargetHighlightComponent>('target-highlight');
      const position = entity.get<PositionComponent>('position');
      const body = entity.get<BodyComponent>('body');

      const originX = position.x - body.width * 0.3;
      const originY = position.y - body.height / 2 + body.height * 0.65;

      if (body && position) {
        if (!highlight.rect) {
          const g = scene.add.graphics({
            x: 0,
            y: 0,
            lineStyle: {
              width: 1,
              color: 0x00ff00,
              alpha: 1,
            },
          });
          g.x = originX;
          g.y = originY;
          g.strokeRoundedRect(0, 0, body.width * 0.6, body.height * 0.4, 3);
          highlight.rect = g;
        }

        highlight.rect.x = Phaser.Math.Linear(highlight.rect.x, originX, 0.5);
        highlight.rect.y = Phaser.Math.Linear(highlight.rect.y, originY, 0.5);
      }
    });
  }
}
