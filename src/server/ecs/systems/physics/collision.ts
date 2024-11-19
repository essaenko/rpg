import { System } from '@shared/ecs/system';
import { Client } from '@colyseus/core';
import { TransportEventTypes } from '@shared/types';
import { Scene } from '@server/core/scene/scene';
import { BodyComponent } from '../../components/physics/body';
import { collide, getTileXY } from '@server/core/helpers/map';
import { ColliderComponent } from '@server/ecs/components/physics/collider';
import { VelocityComponent } from '@server/ecs/components/physics/velocity';
import { PositionComponent } from '@server/ecs/components/physics/position';
import { ECSContainer } from '@shared/ecs';

export class CollisionSystem extends System {
  constructor() {
    super('collision');
  }
  handleMessage(client: Client, type: TransportEventTypes, message: any): void {}

  onUpdate(delta: number, container: ECSContainer, scene: Scene): void {
    container.query(['body', 'collider', 'velocity', 'position']).forEach((entity) => {
      const velocity = entity.get<VelocityComponent>('velocity');
      if (velocity.x || velocity.y) {
        const collider = entity.get<ColliderComponent>('collider');
        const position = entity.get<PositionComponent>('position');
        const body = entity.get<BodyComponent>('body');
        const collayer = scene.map.layers.find((layer) => layer.name === 'collision');
        collider.collides = false;

        collayer.data.forEach((tile, index) => {
          if (tile !== 0) {
            const tilePosition = getTileXY(index, scene.map);
            if (
              collide(
                {
                  ...tilePosition,
                  width: 32,
                  height: 32,
                },
                {
                  x: position.x + velocity.x + collider.x - body.pivotX,
                  y: position.y + velocity.y + collider.y - body.pivotY,
                  width: collider.width,
                  height: collider.height,
                },
              )
            ) {
              collider.collides = true;
            }
          }
        });
      }
    });
  }
}
