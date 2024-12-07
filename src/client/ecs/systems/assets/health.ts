import { System } from '@client/core/ecs/system';
import Phaser from 'phaser';
import { ECSContainer } from '@client/core/ecs';
import { HealthComponent } from '@client/ecs/components/game/stats/health';
import { PositionComponent } from '@client/ecs/components/physics/position';
import { BodyComponent } from '@client/ecs/components/physics/body';
import { HealthFrameComponent } from '@client/ecs/components/game/asset/health-frame';
import { FractionComponent } from '@client/ecs/components/game/fraction';
import { WorldScene } from '@client/core/scene/world-scene';
import { Fraction, Relation } from '@shared/types';
import { getRelation } from '@shared/utils/fractions';
import Sprite = Phaser.Physics.Arcade.Sprite;

export class HealthSystem extends System {
  constructor() {
    super('health');
  }
  onUpdate(scene: WorldScene, container: ECSContainer) {
    container.query(['health', 'position', 'body', 'health-frame']).forEach((entity) => {
      const hfc = entity.get<HealthFrameComponent>('health-frame');
      if (!scene.textures.exists(hfc.asset.key)) return;

      const health = entity.get<HealthComponent>('health');
      const position = entity.get<PositionComponent>('position');
      const body = entity.get<BodyComponent>('body');
      const { fraction: f1 } = entity.get<FractionComponent>('fraction') ?? {
        fraction: Fraction.Neutral,
      };
      const { fraction: f2 } = container.getEntity(scene.room.sessionId)?.get<FractionComponent>('fraction') ?? {
        fraction: Fraction.Neutral,
      };
      const relation = getRelation(f1, f2);

      const originX = position.x - body.width / 2;
      const originY = position.y - body.height / 2;

      if (!hfc.sprite) {
        const left = scene.physics.add.sprite(originX, originY, hfc.asset.key, 0);
        const center = scene.physics.add.sprite(originX + 20, originY, hfc.asset.key, 1);
        const right = scene.physics.add.sprite(originX + 20 + body.width - 40, originY, hfc.asset.key, 2);
        const fill = scene.physics.add.sprite(
          originX + 3,
          originY,
          hfc.asset.key,
          relation === Relation.Friendly ? 3 : relation === Relation.Hostile ? 5 : 4,
        );
        center.displayWidth = body.width - 40;
        fill.displayWidth = (body.width - 6) * (health.current / health.max);

        hfc.sprite = scene.add.group([left, center, right, fill]);
      }

      hfc.sprite.setDepth(position.y + 9999);

      hfc.sprite.children.entries.forEach((item, i) => {
        const sprite = item as Sprite;
        let x = originX;
        sprite.setOrigin(0, 0);

        switch (i) {
          case 1:
            x += 20;
            break;
          case 2:
            x += 20 + body.width - 40;
            break;
          case 3:
            x += 3;
            sprite.displayWidth = (body.width - 6) * (health.current / health.max);
        }

        sprite.y = Phaser.Math.Linear(sprite.y, originY, 0.2);
        sprite.x = Phaser.Math.Linear(sprite.x, x, 0.2);
      });
    });
  }
}
