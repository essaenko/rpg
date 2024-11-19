import { System } from '@shared/ecs/system';
import { Client } from '@colyseus/core';
import { TransportEventTypes } from '@shared/types';
import { VelocityComponent } from '../../components/physics/velocity';
import { PositionComponent } from '../../components/physics/position';
import { ECSContainer } from '@shared/ecs';
import { MoveComponent } from '../../components/game/move';
import { ColliderComponent } from '../../components/physics/collider';

export class MovementSystem extends System {
  constructor() {
    super('movement');
  }
  handleMessage(client: Client, type: TransportEventTypes, message: any, container: ECSContainer): void {
    if (type === TransportEventTypes.Move) {
      container.query(['move']).forEach((entity) => {
        if (entity.id === client.sessionId) {
          const move = entity.get<MoveComponent>('move');
          move.direction = message;
        }
      });
    }
  }

  onUpdate(delta: number, container: ECSContainer): void {
    container.query(['position', 'velocity']).forEach((entity) => {
      const velocity = entity.get<VelocityComponent>('velocity');

      if (velocity.x || velocity.y) {
        const position = entity.get<PositionComponent>('position');
        const collider = entity.get<ColliderComponent>('collider');

        if (!collider?.collides) {
          position.x += velocity.x;
          position.y += velocity.y;
        }
      }
    });
  }
}
