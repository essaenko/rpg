import { System } from '@client/core/ecs/system';
import Phaser, { GameObjects } from 'phaser';
import { ECSContainer } from '@client/core/ecs';
import { Health } from '@client/ecs/components/game/stats/health';
import { Position } from '@client/ecs/components/physics/position';
import { Body } from '@client/ecs/components/physics/body';
import { WorldScene } from '@client/core/scene/world-scene';
import { Appearance } from '@client/ecs/components/game/visual/appearance';
import Container = Phaser.GameObjects.Container;
import { Target } from '@client/ecs/components/game/combat/target';
import { Pointer } from '@client/ecs/components/physics/pointer';
import { TargetHighlight } from '@client/ecs/components/game/visual/target-highlight';
import { DEFAULT_LERP_VALUE, COLORS } from '@client/utils/const';
import { Resource } from '@client/ecs/components/game/stats/resource';
import { getHealthColor, getResourceColor } from '@client/utils/getters';
import { Relation } from '@shared/types';
import { getRelation } from '@shared/utils/fractions';
import { Fraction } from '@client/ecs/components/game/mechanics/fraction';

export class GraphicsSystem extends System {
  constructor() {
    super('graphics');
  }
  onUpdate(scene: WorldScene, container: ECSContainer) {
    const player = container.getEntity(scene.room.sessionId);

    container.query(['target-highlight']).forEach((entity) => {
      const highlight = entity.get<TargetHighlight>('target-highlight');
      const position = entity.get<Position>('position');
      const body = entity.get<Body>('body');
      const isCurrentPlayer = entity.id === scene.room.sessionId;

      const originX = position.x;
      const originY = position.y + body.height * 0.45;

      if (body && position && !isCurrentPlayer) {
        if (!highlight.rect) {
          const round = scene.add.image(0, 0, 'target_round');
          round.displayWidth = body.width * 0.7;
          round.displayHeight = body.height * 0.35;
          round.setPosition(position.x, position.y);
          highlight.rect = round;
        }

        highlight.rect.x = Phaser.Math.Linear(highlight.rect.x, originX, DEFAULT_LERP_VALUE);
        highlight.rect.y = Phaser.Math.Linear(highlight.rect.y, originY, DEFAULT_LERP_VALUE);
      }
    });
    container.query(['pointer']).forEach((entity) => {
      const pointer = entity.get<Pointer>('pointer');

      if (!pointer.frame) {
        pointer.frame = scene.add.image(pointer.x, pointer.y, 'pointer_circle');
        pointer.frame.displayHeight = 32;
        pointer.frame.displayWidth = 32;
      }

      if (pointer.x !== pointer.frame.x || pointer.y !== pointer.frame.y) {
        pointer.frame.x = Phaser.Math.Linear(pointer.frame.x, pointer.x, DEFAULT_LERP_VALUE);
        pointer.frame.y = Phaser.Math.Linear(pointer.frame.y, pointer.y, DEFAULT_LERP_VALUE);
      }
    });
    container.query(['health', 'position', 'body', 'health-frame', 'appearance']).forEach((entity) => {
      const appearance = entity.get<Appearance>('appearance');
      if (!appearance.sprites) return;

      const health = entity.get<Health>('health');
      const resource = entity.get<Resource>('resource');
      const body = entity.get<Body>('body');
      const width = Math.max(body.width, 60);

      let hfcContainer = appearance.sprites.getByName('health_frame') as Container | null;

      if (!hfcContainer) {
        const hfcContainer = scene.add.container(-(width / 2), -body.height * 0.5);
        hfcContainer.name = 'health_frame';
        const graphics = scene.add.graphics();
        graphics.name = 'hfc_graphics';
        hfcContainer.add(graphics);
        graphics.setData({ health: health.current, resource: resource.current });
        this.drawHealthFrame(
          graphics,
          health,
          resource,
          width,
          getRelation(entity.get<Fraction>('fraction')?.fraction, player?.get<Fraction>('fraction')?.fraction),
        );

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

            this.drawHealthFrame(
              g,
              health,
              resource,
              width,
              getRelation(entity.get<Fraction>('fraction')?.fraction, player?.get<Fraction>('fraction')?.fraction),
            );
          }
        }

        hfcContainer.visible = !(player.has('target') && player.get<Target>('target').target !== entity.id);
      }
    });
  }

  drawHealthFrame(
    graphics: GameObjects.Graphics,
    health: Health,
    resource: Resource,
    width: number,
    relation: Relation,
  ) {
    const { health: cHealth, resource: cResource } = graphics.data.values;
    graphics.clear();
    //Background
    graphics.fillStyle(0x00, 1);
    graphics.fillRoundedRect(0, 0, width, 9, 2);
    //Health
    graphics.fillStyle(getHealthColor(relation), 1);
    graphics.fillRoundedRect(1, 1, (width - 2) * (cHealth / health.max), 4, 2);
    //Resource
    graphics.fillStyle(getResourceColor(resource), 1);
    graphics.fillRoundedRect(1, 6, (width - 2) * (cResource / resource.max), 2, 2);
  }
}
