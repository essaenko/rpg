import { System } from '@shared/ecs/system';
import { Client } from '@colyseus/core';
import { TransportEventTypes } from '@shared/types';
import { Velocity } from '../../components/physics/velocity';
import { Position } from '../../components/physics/position';
import { ECSContainer } from '@shared/ecs';
import { Move } from '../../components/game/move';
import { Collider } from '../../components/physics/collider';

export class MovementSystem extends System {
  constructor() {
    super('movement');
  }
  handleMessage(client: Client, type: TransportEventTypes, message: any, container: ECSContainer): void {
    if (type === TransportEventTypes.Move) {
      container.query(['move']).forEach((entity) => {
        if (entity.id === client.sessionId) {
          const move = entity.get<Move>('move');
          move.direction = message;
        }
      });
    }
  }

  onUpdate(delta: number, container: ECSContainer): void {
    container.query(['position', 'velocity']).forEach((entity) => {
      const velocity = entity.get<Velocity>('velocity');

      if (velocity.x || velocity.y) {
        const position = entity.get<Position>('position');
        const collider = entity.get<Collider>('collider');

        if (!collider?.collides) {
          position.x += velocity.x;
          position.y += velocity.y;
        }
      }
    });
  }
}
