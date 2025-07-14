import { System } from '@shared/ecs/system';
import { Client } from '@colyseus/core';
import { TransportEventTypes } from '@shared/types';
import { Scene } from '@server/core/scene/scene';
import { Body } from '../../components/physics/body';
import { collide, collideTriangle, getTileXY } from '@server/core/helpers/map';
import { Collider } from '@server/ecs/components/physics/collider';
import { Velocity } from '@server/ecs/components/physics/velocity';
import { Position } from '@server/ecs/components/physics/position';
import { ECSContainer } from '@shared/ecs';
import { Entity } from '@shared/ecs/entity';

export class CollisionSystem extends System {
  constructor() {
    super('collision');
  }
  handleMessage(client: Client, type: TransportEventTypes, message: any): void {}

  onUpdate(delta: number, container: ECSContainer, scene: Scene): void {
    container.query(['body', 'collider', 'velocity', 'position']).forEach((entity) => {
      const velocity = entity.get<Velocity>('velocity');
      if (velocity.x || velocity.y) {
        const collider = entity.get<Collider>('collider');

        collider.collides = false;

        if (this.collideWithTerrain(scene, entity)) {
          collider.collides = true;

          return;
        }

        for (const object of container.query(entity, 400, ['position', 'body', 'collider', 'tag-object'])) {
          if (this.collideWithObject(entity, object)) {
            collider.collides = true;

            return;
          }
        }
      }
    });
  }

  collideWithObject(entity: Entity, object: Entity): boolean {
    const objCollider = object.get<Collider>('collider');
    const objPosition = object.get<Position>('position');
    const objBody = object.get<Body>('body');
    const position = entity.get<Position>('position');
    const velocity = entity.get<Velocity>('velocity');
    const collider = entity.get<Collider>('collider');
    const body = entity.get<Body>('body');

    return collide(
      {
        x: objPosition.x + objCollider.x - objBody.width / 2, // SetOrigin(0.5, 0.5)
        y: objPosition.y + objCollider.y - objBody.height / 2, // SetOrigin(0.5, 0.5)
        width: objCollider.width,
        height: objCollider.height,
      },
      {
        x: position.x + velocity.x + collider.x - body.width / 2,
        y: position.y + velocity.y + collider.y - body.height / 2,
        width: collider.width,
        height: collider.height,
      },
    );
  }

  collideWithTerrain(scene: Scene, entity: Entity): boolean {
    const collayer = scene.map.layers.find((layer) => layer.name === 'collision');
    const colTiles = scene.map.tilesets.find((tileset) => tileset.name === 'dummy-tile');
    const collider = entity.get<Collider>('collider');
    const position = entity.get<Position>('position');
    const body = entity.get<Body>('body');
    const velocity = entity.get<Velocity>('velocity');
    let collision;

    for (const [index, tile] of collayer.data.entries()) {
      if (tile !== 0) {
        const tileInfo = colTiles.tiles.find((t) => t.id === tile - colTiles.firstgid);
        const tilePosition = getTileXY(index, scene.map);
        const b1 = {
          ...tilePosition,
          width: 32,
          height: 32,
        };
        const b2 = {
          x: position.x + velocity.x - body.width / 2 + collider.x,
          y: position.y + velocity.y - body.height / 2 + collider.y,
          width: collider.width,
          height: collider.height,
        };

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
              case 5:
                collision = collide({ ...b1, width: b1.width / 2 }, b2);
                break;
              case 6:
                collision = collide({ ...b1, height: b1.height / 2, y: b1.y + b1.height / 2 }, b2);
                break;
              case 7:
                collision = collide({ ...b1, width: b1.width / 2, x: b1.x + b1.width / 2 }, b2);
                break;
              case 8:
                collision = collide({ ...b1, height: b1.height / 2 }, b2);
                break;
              case 9:
                collision = collide({ ...b1, width: b1.width / 2, height: b1.height / 2 }, b2);
                break;
              case 10:
                collision = collide({ ...b1, x: b1.x + b1.width / 2, width: b1.width / 2, height: b1.height / 2 }, b2);
                break;
              case 11:
                collision = collide(
                  {
                    ...b1,
                    x: b1.x + b1.width / 2,
                    y: b1.y + b1.height / 2,
                    width: b1.width / 2,
                    height: b1.height / 2,
                  },
                  b2,
                );
                break;
              case 12:
                collision = collide(
                  {
                    ...b1,
                    y: b1.y + b1.height / 2,
                    width: b1.width / 2,
                    height: b1.height / 2,
                  },
                  b2,
                );
                break;
            }
          }
        } else {
          collision = collide(b1, b2);
        }

        if (collision) {
          console.log('Collided with terrain');
          return true;
        }
      }
    }

    return false;
  }
}
