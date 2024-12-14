import { System } from '@shared/ecs/system';
import { Client } from '@colyseus/core';
import { TransportEventTypes } from '@shared/types';
import { Scene } from '@server/core/scene/scene';
import { Body } from '../../components/physics/body';
import { collide, getTileXY } from '@server/core/helpers/map';
import { Collider } from '@server/ecs/components/physics/collider';
import { Velocity } from '@server/ecs/components/physics/velocity';
import { Position } from '@server/ecs/components/physics/position';
import { ECSContainer } from '@shared/ecs';

export class CollisionSystem extends System {
  constructor() {
    super('collision');
  }
  handleMessage(client: Client, type: TransportEventTypes, message: any): void {}

  onUpdate(delta: number, container: ECSContainer, scene: Scene): void {
    const objects = container.query(['position', 'body', 'collider', 'tag-object']).toArray();
    container.query(['body', 'collider', 'velocity', 'position']).forEach((entity) => {
      const velocity = entity.get<Velocity>('velocity');
      if (velocity.x || velocity.y) {
        const collider = entity.get<Collider>('collider');
        const position = entity.get<Position>('position');
        const body = entity.get<Body>('body');
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

        objects.forEach((object) => {
          const objCollider = object.get<Collider>('collider');
          const objPosition = object.get<Position>('position');
          const objBody = object.get<Body>('body');
          if (
            collide(
              {
                x: objPosition.x + objCollider.x - objBody.pivotX,
                y: objPosition.y + objCollider.y - objBody.pivotY,
                width: objCollider.width,
                height: objCollider.height,
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
        });
      }
    });
  }
}
