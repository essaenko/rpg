import { System } from '@client/core/ecs/system';
import Phaser from 'phaser';
import { ECSContainer } from '@client/core/ecs';
import { Health } from '@client/ecs/components/game/stats/health';
import { Position } from '@client/ecs/components/physics/position';
import { Body } from '@client/ecs/components/physics/body';
import { HealthFrame } from '@client/ecs/components/game/asset/health-frame';
import { Fraction } from '@client/ecs/components/game/fraction';
import { WorldScene } from '@client/core/scene/world-scene';
import { Fraction as Fractions, Relation } from '@shared/types';
import { getRelation } from '@shared/utils/fractions';
import Sprite = Phaser.Physics.Arcade.Sprite;
import { Appearance } from '@client/ecs/components/game/appearance';
import Container = Phaser.GameObjects.Container;
import { Target } from '@client/ecs/components/game/combat/target';

export class HealthSystem extends System {
  constructor() {
    super('health');
  }
  onUpdate(scene: WorldScene, container: ECSContainer) {
    container.query(['health', 'position', 'body', 'health-frame', 'appearance']).forEach((entity) => {
      const hfc = entity.get<HealthFrame>('health-frame');
      const appearance = entity.get<Appearance>('appearance');
      if (!scene.textures.exists(hfc.asset.key) || !appearance.sprites) return;

      const health = entity.get<Health>('health');
      const position = entity.get<Position>('position');
      const body = entity.get<Body>('body');
      const player = container.getEntity(scene.room.sessionId);

      const { fraction: f1 } = entity.get<Fraction>('fraction') ?? {
        fraction: Fractions.Neutral,
      };
      const { fraction: f2 } = container.getEntity(scene.room.sessionId)?.get<Fraction>('fraction') ?? {
        fraction: Fractions.Neutral,
      };
      const relation = getRelation(f1, f2);
      const width = Math.max(body.width, 60);

      let hfcContainer = appearance.sprites.getByName('health-frame') as Container | null;

      if (!hfcContainer) {
        const hfcContainer = scene.add.container(-(width / 2), -body.height * 0.65);
        hfcContainer.name = 'health-frame';
        const left = scene.physics.add.sprite(0, 0, hfc.asset.key, 0);
        left.name = 'health_frame_left';
        const center = scene.physics.add.sprite(20, 0, hfc.asset.key, 1);
        center.name = 'health_frame_center';
        const right = scene.physics.add.sprite(20 + width - 40, 0, hfc.asset.key, 2);
        right.name = 'health_frame_right';
        const fill = scene.physics.add.sprite(
          3,
          0,
          hfc.asset.key,
          relation === Relation.Friendly ? 3 : relation === Relation.Hostile ? 5 : 4,
        );
        fill.name = 'health_frame_fill';
        center.displayWidth = width - 40;
        fill.displayWidth = (width - 6) * (health.current / health.max);

        hfcContainer.add([left, center, right, fill]);
        hfcContainer.iterate((sprite: Sprite) => {
          sprite.setOrigin(0, 0);
        });

        appearance.sprites.add(hfcContainer);
      } else {
        const fill = hfcContainer.getByName('health_frame_fill') as Sprite;

        if (fill) {
          fill.displayWidth = (width - 6) * (health.current / health.max);
        }

        hfcContainer.visible = !(player.has('target') && player.get<Target>('target').target !== entity.id);
      }
    });
  }
}
