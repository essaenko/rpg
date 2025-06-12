import { System } from '@shared/ecs/system';
import { Client } from '@colyseus/core';
import { Animation, Pointer2D, TransportEventTypes } from '@shared/types';
import { ECSContainer } from '@shared/ecs';
import { Scene } from '@server/core/scene/scene';
import { Move } from '../../components/game/move';
import { Velocity } from '../../components/physics/velocity';
import { Speed } from '../../components/physics/speed';
import { Patrol } from '@server/ecs/components/game/behaviour/patrol/patrol';
import { Appearance } from '@server/ecs/components/game/appearance';
import { DEFAULT_SPEED } from '@server/utils/game/const';
import { Death } from '@server/ecs/components/game/mechanics/death';
import { TargetPoint } from '@server/ecs/components/game/behaviour/patrol/target-point';
import { getVelocityByVector } from '@shared/utils/physics';
import { tileToPosition } from '@server/utils/map/tiled';
import { Position } from '@server/ecs/components/physics/position';

export class MoveSystem extends System {
  constructor() {
    super('move');
  }

  handleMessage(client: Client, type: TransportEventTypes, message: any, container: ECSContainer): void {}

  onUpdate(delta: number, container: ECSContainer, scene: Scene): void {
    container.query(['velocity'], ['projectile']).forEach((entity) => {
      const velocity = entity.get<Velocity>('velocity');
      const appearance = entity.get<Appearance>('appearance');

      if (appearance) {
        appearance.animation = Animation.Idle;
      }

      velocity.x = 0;
      velocity.y = 0;

      this.setAppearanceAnimationKey(velocity, appearance);
    });
    container.query(['move', 'velocity', 'speed']).forEach((entity) => {
      const move = entity.get<Move>('move');
      const velocity = entity.get<Velocity>('velocity');
      const speed = entity.get<Speed>('speed');
      const appearance = entity.get<Appearance>('appearance');
      const death = entity.get<Death>('death');

      if (velocity && move && speed && !death?.dead) {
        const vector = {
          x: move.angle ? Math.cos(move.angle) : 0,
          y: move.angle ? Math.sin(move.angle) : 0,
        };

        velocity.x = vector.x * (speed.speed * DEFAULT_SPEED) * delta;
        velocity.y = vector.y * (speed.speed * DEFAULT_SPEED) * delta;

        if (velocity.x !== 0 || velocity.y !== 0) {
          if (entity.has('channeling')) {
            entity.remove('channeling');
          }

          if (entity.has('loot')) {
            entity.remove('loot');
          }
        }

        this.setAppearanceAnimationKey(vector, appearance);
      }
    });

    container.query(['velocity', 'speed', 'target-point']).forEach((entity) => {
      const target = entity.get<TargetPoint>('target-point');
      const pos = entity.get<Position>('position');
      const velocity = entity.get<Velocity>('velocity');
      const speed = entity.get<Speed>('speed');
      const appearance = entity.get<Appearance>('appearance');
      const death = entity.get<Death>('death');

      if (target && !death?.dead) {
        const vector = getVelocityByVector(pos, target);
        velocity.x = vector.x * (speed.speed * DEFAULT_SPEED) * delta;
        velocity.y = vector.y * (speed.speed * DEFAULT_SPEED) * delta;

        if (velocity.x !== 0 || velocity.y !== 0) {
          entity.remove('channeling');
        }

        this.setAppearanceAnimationKey(vector, appearance);
      }
    });
  }

  setAppearanceAnimationKey(vector: Pointer2D, appearance: Appearance | null) {
    if (appearance) {
      if (vector.y > 0) {
        appearance.animation = Animation.MovingBackward;
      }
      if (vector.y < 0) {
        appearance.animation = Animation.MovingForward;
      }

      if (vector.x > 0.5) {
        appearance.animation = Animation.MovingRight;
      }

      if (vector.x < -0.5) {
        appearance.animation = Animation.MovingLeft;
      }
    }
  }
}
