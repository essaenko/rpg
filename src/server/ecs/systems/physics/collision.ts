import { System } from '@shared/ecs/system';
import { Client } from '@colyseus/core';
import { TransportEventTypes } from '@shared/types';
import { Scene } from '@server/core/scene/scene';
import { Body } from '../../components/physics/body';
import { collide, collideSide, collideTriangle, getTileXY } from '@server/core/helpers/map';
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
        const colTiles = scene.map.tilesets.find((tileset) => tileset.name === 'dummy-tile');
        collider.collides = false;
        collider.collidesX = false;
        collider.collidesY = false;

        collayer.data.forEach((tile, index) => {
          if (tile !== 0) {
            const tileInfo = colTiles.tiles.find((t) => t.id === tile - colTiles.firstgid);
            const tilePosition = getTileXY(index, scene.map);
            const b1 = {
              ...tilePosition,
              width: 32,
              height: 32,
            };
            const b2 = {
              x: position.x + velocity.x + collider.x - body.pivotX,
              y: position.y + velocity.y + collider.y - body.pivotY,
              width: collider.width,
              height: collider.height,
            };

            let collision;

            if (tileInfo) {
              const colliderType = tileInfo.properties.find(({ name, type }) => name === 'collider' && type === 'int');

              if (colliderType) {
                switch (colliderType.value) {
                  case 0:
                    collision = collide(b1, b2);
                    break;
                  case 1:
                    collision = collideTriangle(b2, {
                      a: { x: b1.x, y: b1.y },
                      b: { x: b1.x + b1.width, y: b1.y },
                      c: { x: b1.x + b1.width, y: b1.y + b1.height },
                    });
                    break;
                  case 2:
                    collision = collideTriangle(b2, {
                      a: { x: b1.x, y: b1.y },
                      b: { x: b1.x, y: b1.y + b1.height },
                      c: { x: b1.x + b1.width, y: b1.y + b1.height },
                    });
                    break;
                  case 3:
                    collision = collideTriangle(b2, {
                      a: { x: b1.x, y: b1.y },
                      b: { x: b1.x, y: b1.y + b1.height },
                      c: { x: b1.x + b1.width, y: b1.y },
                    });
                    break;
                  case 4:
                    collision = collideTriangle(b2, {
                      a: { x: b1.x, y: b1.y + b1.height },
                      b: { x: b1.x + b1.width, y: b1.y + b1.height },
                      c: { x: b1.x + b1.width, y: b1.y },
                    });
                    break;
                }
              }
            } else {
              collision = collide(b1, b2);
            }

            if (collision) {
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
