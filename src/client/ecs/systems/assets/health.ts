import { System } from '@client/core/ecs/system';
import Phaser from 'phaser';
import { ECSContainer } from '@client/core/ecs';
import { HealthComponent } from '@client/ecs/components/game/stats/health';
import { PositionComponent } from '@client/ecs/components/physics/position';
import { BodyComponent } from '@client/ecs/components/physics/body';

export class HealthSystem extends System {
  constructor() {
    super('health');
  }
  onUpdate(scene: Phaser.Scene, container: ECSContainer) {
    container.query(['health', 'position', 'body']).forEach((entity) => {
      const health = entity.get<HealthComponent>('health');
      const position = entity.get<PositionComponent>('position');
      const body = entity.get<BodyComponent>('body');
      const originX = position.x - body.width / 2;
      const originY = position.y - body.height / 2;

      if (health.object) {
        health.object.destroy();
      }

      const graphics = scene.add.graphics({
        lineStyle: {
          width: 1,
          color: 0xffd700,
        },
        fillStyle: {
          color: 0x0,
        },
      });

      graphics.x = originX;
      graphics.y = originY;
      graphics.fillRect(0, 0, body.width, 10);
      graphics.fillStyle(0x09ad00, 1);
      graphics.fillRect(0, 0, body.width * (health.current / health.max), 10);
      graphics.strokeRect(0, 0, body.width, 10);

      health.object = graphics;

      if (health.object.x === originX && health.object.y === originY) {
        health.object.x = Math.round(originX);
        health.object.y = Phaser.Math.Linear(health.object.y, originY, 0.1);
      } else {
        health.object.x = Phaser.Math.Linear(health.object.x, originX, 0.1);
        health.object.y = Phaser.Math.Linear(health.object.y, originY, 0.1);
      }
      health.object.depth = position.y + 9999;
    });
  }
}
