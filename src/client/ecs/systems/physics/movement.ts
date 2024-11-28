import Phaser from 'phaser';

import { System } from '@client/core/ecs/system';
import { ECSContainer } from '@client/core/ecs';
import { PositionComponent } from '@client/ecs/components/physics/position';
import { SpriteComponent } from '@client/ecs/components/game/asset/sprite';
import { SightDirectionComponent } from '@client/ecs/components/physics/sight-direction';
import { AnimationComponent } from '@client/ecs/components/game/asset/animation';

export class MovementSystem extends System {
  constructor() {
    super('movement');
  }

  onUpdate(scene: Phaser.Scene, container: ECSContainer): void {
    container.query(['position']).forEach((entity) => {
      const position = entity.get<PositionComponent>('position');
      const sightDirection = entity.get<SightDirectionComponent>('sight-direction');
      const animation = entity.get<AnimationComponent>('animation');
      const { sprite } = entity.get<SpriteComponent>('sprite') ?? {};

      if (position && sprite) {
        if (sprite.x !== position.x) {
          sprite.x = Phaser.Math.Linear(sprite.x, position.x, 0.2);
        }
        if (sprite.y !== position.y) {
          sprite.y = Phaser.Math.Linear(sprite.y, position.y, 0.2);
        }

        if (animation) {
          if (Math.round(sprite.y) !== Math.round(position.y)) {
            if (sprite.y > position.y) {
              if (sightDirection) {
                sightDirection.direction = 'forward';
              }
              if (animation.key !== 'walk_left' && animation.key !== 'walk_right') {
                animation.key = 'walk_forward';
              }
            } else {
              if (sightDirection) {
                sightDirection.direction = 'backward';
              }
              if (animation.key !== 'walk_left' && animation.key !== 'walk_right') {
                animation.key = 'walk_backward';
              }
            }
          }

          if (Math.round(sprite.x) !== Math.round(position.x)) {
            if (sprite.x > position.x) {
              animation.key = 'walk_left';
              sightDirection.direction = 'left';
            } else {
              animation.key = 'walk_right';
              sightDirection.direction = 'right';
            }
          }

          if (
            Math.round(sprite.x) === Math.round(position.x) &&
            Math.round(sprite.y) === Math.round(position.y) &&
            !sprite.anims.isPlaying
          ) {
            animation.key = null;
            animation.config = {
              key: `idle_${sightDirection.direction}`,
              repeat: -1,
              repeatDelay: 1000,
              yoyo: true,
            };
          }
        }
      }
    });
  }
}
