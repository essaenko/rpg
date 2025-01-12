import { System } from '@shared/ecs/system';
import { Client } from '@colyseus/core';
import { Animation, Directions, TransportEventTypes } from '@shared/types';
import { ECSContainer } from '@shared/ecs';
import { Scene } from '@server/core/scene/scene';
import { Move } from '../../components/game/move';
import { Velocity } from '../../components/physics/velocity';
import { Speed } from '../../components/physics/speed';
import { Patrol } from '@server/ecs/components/game/behaviour/patrol';
import { Appearance } from '@server/ecs/components/game/appearance';

export class MoveSystem extends System {
  constructor() {
    super('move');
  }

  handleMessage(client: Client, type: TransportEventTypes, message: any, container: ECSContainer): void {}

  onUpdate(delta: number, container: ECSContainer, scene: Scene): void {
    container.query(['move', 'velocity', 'speed']).forEach((entity) => {
      const move = entity.get<Move>('move');
      const velocity = entity.get<Velocity>('velocity');
      const speed = entity.get<Speed>('speed');
      const appearance = entity.get<Appearance>('appearance');

      if (velocity && move && speed) {
        velocity.x = 0;
        velocity.y = 0;

        if (appearance) {
          appearance.animation = Animation.Idle;
        }

        if (move.vector[1] < 0) {
          velocity.y += move.vector[1] * speed.speed * delta;

          if (appearance) {
            appearance.animation = Animation.MovingForward;
          }
        }
        if (move.vector[1] > 0) {
          velocity.y += move.vector[1] * speed.speed * delta;

          if (appearance) {
            appearance.animation = Animation.MovingBackward;
          }
        }
        if (move.vector[0] < 0) {
          velocity.x += move.vector[0] * speed.speed * delta;

          if (appearance) {
            appearance.animation = Animation.MovingLeft;
          }
        }
        if (move.vector[0] > 0) {
          velocity.x += move.vector[0] * speed.speed * delta;

          if (appearance) {
            appearance.animation = Animation.MovingRight;
          }
        }
      }
    });

    container.query(['velocity', 'speed', 'patrol']).forEach((entity) => {
      const patrol = entity.get<Patrol>('patrol');
      const velocity = entity.get<Velocity>('velocity');
      const speed = entity.get<Speed>('speed');
      const appearance = entity.get<Appearance>('appearance');

      velocity.x = 0;
      velocity.y = 0;

      if (appearance) {
        appearance.animation = Animation.Idle;
      }

      if (patrol.active && patrol.vector) {
        velocity.x = patrol.vector.x * speed.speed * delta;
        velocity.y = patrol.vector.y * speed.speed * delta;

        if (appearance) {
          if (velocity.y > 0) {
            appearance.animation = Animation.MovingBackward;
          }
          if (velocity.y < 0) {
            appearance.animation = Animation.MovingForward;
          }
          if (velocity.x > 0) {
            appearance.animation = Animation.MovingRight;
          }
          if (velocity.x < 0) {
            appearance.animation = Animation.MovingLeft;
          }
        }
      }
    });
  }
}
