import { System } from '@client/core/ecs/system';
import Phaser, { GameObjects } from 'phaser';
import { ECSContainer } from '@client/core/ecs';
import { Health } from '@client/ecs/components/game/stats/health';
import { Position } from '@client/ecs/components/physics/position';
import { Body } from '@client/ecs/components/physics/body';
import { HealthFrame } from '@client/ecs/components/game/visual/health-frame';
import { Fraction } from '@client/ecs/components/game/mechanics/fraction';
import { WorldScene } from '@client/core/scene/world-scene';
import { Fraction as Fractions, Relation } from '@shared/types';
import { getRelation } from '@shared/utils/fractions';
import Sprite = Phaser.Physics.Arcade.Sprite;
import { Appearance } from '@client/ecs/components/game/visual/appearance';
import Container = Phaser.GameObjects.Container;
import { Target } from '@client/ecs/components/game/combat/target';
import { Pointer } from '@client/ecs/components/physics/pointer';
import { TargetHighlight } from '@client/ecs/components/game/visual/target-highlight';
import { DEFAULT_LERP_VALUE } from '@client/utils/const';
import { Resource } from '@client/ecs/components/game/stats/resource';
import { Heal } from '@server/mechanics/spells/priest/heal';

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
      const appearance = entity.get<Appearance>('appearance');
      if (!appearance.sprites) return;

      const health = entity.get<Health>('health');
      const resource = entity.get<Resource>('resource');
      const body = entity.get<Body>('body');
      const player = container.getEntity(scene.room.sessionId);
      const width = Math.max(body.width, 60);

      let hfcContainer = appearance.sprites.getByName('health_frame') as Container | null;

      if (!hfcContainer) {
        const hfcContainer = scene.add.container(-(width / 2), -body.height * 0.5);
        hfcContainer.name = 'health_frame';
        const graphics = scene.add.graphics();
        graphics.name = 'hfc_graphics';
        hfcContainer.add(graphics);
        graphics.setData({ health: health.current, resource: resource.current });
        this.drawHealthFrame(graphics, health, resource, width);

        appearance.sprites.add(hfcContainer);
      } else {
        const g = hfcContainer.getByName('hfc_graphics') as GameObjects.Graphics;

        if (g) {
          const lastHealth = g.getData('health');
          const lastResource = g.getData('resource');
          if (lastHealth !== health.current || lastResource !== health.current) {
            g.setData({
              health: Phaser.Math.Linear(lastHealth, health.current, 0.1),
              resource: Phaser.Math.Linear(lastResource, resource.current, 0.1),
            });

            this.drawHealthFrame(g, health, resource, width);
          }
        }

        hfcContainer.visible = !(player.has('target') && player.get<Target>('target').target !== entity.id);
      }
    });
  }

  drawHealthFrame(graphics: GameObjects.Graphics, health: Health, resource: Resource, width: number) {
    const { health: cHealth, resource: cResource } = graphics.data.values;
    graphics.clear();
    //Background
    graphics.fillStyle(0x00, 1);
    graphics.fillRoundedRect(0, 0, width, 9, 2);
    //Health
    graphics.fillStyle(0x8a0303, 1);
    graphics.fillRoundedRect(1, 1, (width - 2) * (cHealth / health.max), 4, 2);
    //Resource
    graphics.fillStyle(0x3146b0, 1);
    graphics.fillRoundedRect(1, 6, (width - 2) * (cResource / resource.max), 2, 2);
  }
}
