import { System } from '@shared/ecs/system';
import { Client } from '@colyseus/core';
import { Directions, TransportEventTypes } from '@shared/types';
import { ECSContainer } from '@shared/ecs';
import { Scene } from '@server/core/scene/scene';
import { MoveComponent } from '../../components/game/move';
import { VelocityComponent } from '../../components/physics/velocity';
import { SpeedComponent } from '../../components/physics/speed';

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

      if (velocity && move && speed) {
        velocity.x = 0;
        velocity.y = 0;

        if (move.direction.includes(Directions.Forward)) {
          velocity.y -= speed.speed * delta;
        }
        if (move.direction.includes(Directions.Backward)) {
          velocity.y += speed.speed * delta;
        }
        if (move.direction.includes(Directions.Left)) {
          velocity.x -= speed.speed * delta;
        }
        if (move.direction.includes(Directions.Right)) {
          velocity.x += speed.speed * delta;
        }
      }
    });
  }
}
