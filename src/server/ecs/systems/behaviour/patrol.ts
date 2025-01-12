import { System } from '@shared/ecs/system';
import { Client } from '@colyseus/core';
import { TransportEventTypes } from '@shared/types';
import { ECSContainer } from '@shared/ecs';
import { Scene } from '@server/core/scene/scene';
import { Patrol } from '@server/ecs/components/game/behaviour/patrol';
import { AStarService } from '@shared/ecs/service/a-star';
import { Position } from '@server/ecs/components/physics/position';
import { positionToTile, tileToPosition } from '@server/utils/map/tiled';
import { getVelocityByVector, isInTheSamePosition } from '@shared/utils/physics';

export class PatrolSystem extends System {
  constructor() {
    super('patrol');
  }

  handleMessage(client: Client, type: TransportEventTypes, message: any, container: ECSContainer): void {}

  onUpdate(delta: number, container: ECSContainer, scene: Scene): void {
    container.query(['patrol']).forEach(async (entity) => {
      const patrol = entity.get<Patrol>('patrol');
      const position = entity.get<Position>('position');

      if (patrol.active === undefined) {
        patrol.active = false;
        if (isInTheSamePosition(position, patrol.current)) {
          patrol.current = patrol.path[1];
        }
        patrol.starPath = await container
          .getService<AStarService>('a-star')
          .find(positionToTile(position.x, position.y), positionToTile(patrol.current.x, patrol.current.y));

        if (patrol.starPath) {
          patrol.starCurrent = patrol.starPath[0];
          patrol.active = true;
        }
      }

      if (patrol.active) {
        if (isInTheSamePosition(position, tileToPosition(patrol.starCurrent.x, patrol.starCurrent.y), 5)) {
          if (patrol.starPath[patrol.starPath.indexOf(patrol.starCurrent) + 1]) {
            patrol.starCurrent = patrol.starPath[patrol.starPath.indexOf(patrol.starCurrent) + 1];
          } else {
            patrol.current = patrol.path[patrol.path.indexOf(patrol.current) + 1] ?? patrol.path[0];
            patrol.starPath = await container
              .getService<AStarService>('a-star')
              .find(positionToTile(position.x, position.y), positionToTile(patrol.current.x, patrol.current.y));
            patrol.starCurrent = patrol.starPath[0];
          }
        }
        patrol.vector = getVelocityByVector(position, tileToPosition(patrol.starCurrent.x, patrol.starCurrent.y));
      }
    });
  }
}
