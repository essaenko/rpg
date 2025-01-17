import { ECSContainer } from '@client/core/ecs';
import { Entity } from '@client/core/ecs/entity/entity';
import { Level } from '@client/ecs/components/game/level';
import { Health } from '@client/ecs/components/game/stats/health';
import { Resource } from '@client/ecs/components/game/stats/resource';
import { ResourceType } from '@shared/types';
import { Scene, GameObjects } from 'phaser';

type Container = GameObjects.Container;
type Graphics = GameObjects.Graphics;

export class HealthBar extends Scene {
  private ecs: ECSContainer;
  private player: Entity;
  private player_id: string;

  private level: Level;
  private health: Health;
  private resource: Resource;

  private container: Container;
  private last_value: { resource: number; health: number } = {
    resource: null,
    health: null,
  };

  constructor() {
    super('health-bar');
  }

  init({ ecs, id }: { ecs: ECSContainer; id: string }) {
    this.ecs = ecs;
    this.player_id = id;
  }

  update() {
    if (!this.player) {
      const player = this.ecs.getEntity(this.player_id);

      if (player) {
        this.player = player;
        this.initOverlay();
      }
    }

    if (this.resource && this.health) {
      this.updateOverlay();
    }
  }

  initOverlay() {
    this.level = this.player.get<Level>('level');
    this.health = this.player.get<Health>('health');
    this.resource = this.player.get<Resource>('resource');

    this.container = this.add.container(10, 10);

    const bg = this.add.graphics();
    bg.name = 'background';
    const hp_fill = this.add.graphics();
    hp_fill.name = 'hp-fill';
    const resource_fill = this.add.graphics();
    resource_fill.name = 'resource-fill';

    bg.fillStyle(0xe7e7e7, 1);
    bg.fillRoundedRect(0, 0, 350, 100, 10);
    bg.fillStyle(0x000, 1);
    bg.fillRoundedRect(100, 15, 245, 30, 15);
    bg.fillRoundedRect(100, 55, 245, 30, 15);
    bg.fillCircle(50, 50, 45);

    this.container.add([bg, hp_fill, resource_fill]);
    this.updateOverlay();
  }
  updateOverlay() {
    if (this.health.current !== this.last_value.health) {
      const fill = this.container.getByName<Graphics>('hp-fill');
      if (fill) {
        fill.clear();
        fill.fillStyle(0x8b0000, 1);
        fill.fillRoundedRect(100, 15, (this.health.current / this.health.max) * 245, 30, 15);
        this.last_value.health = this.health.current;
      }
    }
    if (this.resource.current !== this.last_value.resource) {
      const fill = this.container.getByName<Graphics>('resource-fill');
      if (fill) {
        fill.clear();
        switch (this.resource.type) {
          case ResourceType.Mana:
            fill.fillStyle(0x4682b4, 1);
            break;
          case ResourceType.Energy:
            fill.fillStyle(0xffa500, 1);
            break;
          case ResourceType.Rage:
            fill.fillStyle(0xff4500, 1);
        }
        fill.fillRoundedRect(100, 55, (this.resource.current / this.resource.max) * 245, 30, 15);
        this.last_value.resource = this.resource.current;
      }
    }
  }
}
