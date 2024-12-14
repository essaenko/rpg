import Phaser from 'phaser';

import { System } from '@client/core/ecs/system';
import { ECSContainer } from '@client/core/ecs';
import { Position } from '@client/ecs/components/physics/position';
import { Appearance } from '@client/ecs/components/game/appearance';

export class MovementSystem extends System {
  constructor() {
    super('movement');
  }

  onUpdate(scene: Phaser.Scene, container: ECSContainer): void {
    container.query(['position']).forEach((entity) => {
      const position = entity.get<Position>('position');
      const { sprites } = entity.get<Appearance>('appearance') ?? {};

      if (position && sprites) {
        if (sprites.x !== position.x) {
          sprites.x = Phaser.Math.Linear(sprites.x, position.x, 0.2);
        }
        if (sprites.y !== position.y) {
          sprites.y = Phaser.Math.Linear(sprites.y, position.y, 0.2);
        }
      }
    });
  }
}
