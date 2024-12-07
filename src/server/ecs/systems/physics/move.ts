import { System } from '@shared/ecs/system';
import { Client } from '@colyseus/core';
import { Animation, Directions, TransportEventTypes } from '@shared/types';
import { ECSContainer } from '@shared/ecs';
import { Scene } from '@server/core/scene/scene';
import { MoveComponent } from '../../components/game/move';
import { VelocityComponent } from '../../components/physics/velocity';
import { SpeedComponent } from '../../components/physics/speed';
import { PatrolComponent } from '@server/ecs/components/game/behaviour/patrol';
import { AppearanceComponent } from '@server/ecs/components/game/appearance';

export class MoveSystem extends System {
  constructor() {
    super('move');
  }

  handleMessage(client: Client, type: TransportEventTypes, message: any, container: ECSContainer): void {}

  onUpdate(delta: number, container: ECSContainer, scene: Scene): void {
    container.query(['move', 'velocity', 'speed']).forEach((entity) => {
      const move = entity.get<MoveComponent>('move');
      const velocity = entity.get<VelocityComponent>('velocity');
      const speed = entity.get<SpeedComponent>('speed');
      const appearance = entity.get<AppearanceComponent>('appearance');

      if (velocity && move && speed) {
        velocity.x = 0;
        velocity.y = 0;

        if (appearance) {
          appearance.animation = Animation.Idle;
        }

        if (move.direction.includes(Directions.Forward)) {
          velocity.y -= speed.speed * delta;

          if (appearance) {
            appearance.animation = Animation.MovingForward;
          }
        }
        if (move.direction.includes(Directions.Backward)) {
          velocity.y += speed.speed * delta;

          if (appearance) {
            appearance.animation = Animation.MovingBackward;
          }
        }
        if (move.direction.includes(Directions.Left)) {
          velocity.x -= speed.speed * delta;

          if (appearance) {
            appearance.animation = Animation.MovingLeft;
          }
        }
        if (move.direction.includes(Directions.Right)) {
          velocity.x += speed.speed * delta;

          if (appearance) {
            appearance.animation = Animation.MovingRight;
          }
        }
      }
    });

    container.query(['velocity', 'speed', 'patrol']).forEach((entity) => {
      const patrol = entity.get<PatrolComponent>('patrol');
      const velocity = entity.get<VelocityComponent>('velocity');
      const speed = entity.get<SpeedComponent>('speed');
      const appearance = entity.get<AppearanceComponent>('appearance');

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
