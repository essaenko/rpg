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
import { Appearance } from '@client/ecs/components/game/asset/appearance';
import Container = Phaser.GameObjects.Container;
import { Target } from '@client/ecs/components/game/combat/target';
import { Pointer } from '@client/ecs/components/physics/pointer';
import { TargetHighlight } from '@client/ecs/components/game/target-highlight';
import { DEFAULT_LERP_VALUE } from '@client/utils/const';

export class GraphicsSystem extends System {
  constructor() {
    super('graphics');
  }
  onUpdate(scene: WorldScene, container: ECSContainer) {
    container.query(['target-highlight']).forEach((entity) => {
      const highlight = entity.get<TargetHighlight>('target-highlight');
      const position = entity.get<Position>('position');
      const body = entity.get<Body>('body');

      const originX = position.x;
      const originY = position.y + body.height * 0.45;

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
          g.strokeEllipse(0, 0, body.width * 0.7, body.height * 0.35);
          highlight.rect = g;
        }

        highlight.rect.x = Phaser.Math.Linear(highlight.rect.x, originX, DEFAULT_LERP_VALUE);
        highlight.rect.y = Phaser.Math.Linear(highlight.rect.y, originY, DEFAULT_LERP_VALUE);
      }
    });
    container.query(['pointer']).forEach((entity) => {
      const pointer = entity.get<Pointer>('pointer');

      if (!pointer.frame) {
        pointer.frame = scene.add.graphics({
          x: pointer.x,
          y: pointer.y,
          lineStyle: {
            width: 1,
            color: 0xffd600,
            alpha: 1,
          },
        });
        pointer.frame.strokeCircle(0, 25, 15);
      }

      if (pointer.x !== pointer.frame.x || pointer.y !== pointer.frame.y) {
        pointer.frame.x = pointer.x;
        pointer.frame.y = pointer.y;
      }
    });
    container.query(['health', 'position', 'body', 'health-frame', 'appearance']).forEach((entity) => {
      const hfc = entity.get<HealthFrame>('health-frame');
      const appearance = entity.get<Appearance>('appearance');
      if (!scene.textures.exists(hfc.asset.key) || !appearance.sprites) return;

      const health = entity.get<Health>('health');
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

      let hfcContainer = appearance.sprites.getByName('health_frame') as Container | null;

      if (!hfcContainer) {
        const hfcContainer = scene.add.container(-(width / 2), -body.height * 0.5);
        hfcContainer.name = 'health_frame';
        const graphics = scene.add.graphics();
        graphics.name = 'health_frame_grafics';
        hfcContainer.add(graphics);
        graphics.fillStyle(0x00, 1);
        graphics.fillRoundedRect(0, 0, width, 9, 2);
        graphics.fillStyle(0x8a0303, 1);
        const healthRect = graphics.fillRoundedRect(1, 1, width - 2, 4, 2);
        healthRect.name = 'health_frame_fill';
        hfcContainer.add(healthRect);
        graphics.fillStyle(0x3146b0, 1);
        graphics.fillRoundedRect(1, 6, width - 2, 2, 2);

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
