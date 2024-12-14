import Phaser from 'phaser';

import { System } from '@client/core/ecs/system';
import { ECSContainer } from '@client/core/ecs';
import { Position } from '@client/ecs/components/physics/position';
import { Appearance } from '@client/ecs/components/game/appearance';
import { Pointer } from '@client/ecs/components/physics/pointer';
import { WorldScene } from '@client/core/scene/world-scene';
import { getVelocityByVector, isInTheSamePosition } from '@shared/utils/physics';
import { TransportEventTypes } from '@shared/types';

export class MovementSystem extends System {
  constructor() {
    super('movement');
  }

  onUpdate(scene: WorldScene, container: ECSContainer): void {
    container.query(['position']).forEach((entity) => {
      const position = entity.get<Position>('position');
      const { sprites } = entity.get<Appearance>('appearance') ?? {};

      if (position && sprites) {
        if (sprites.x !== position.x) {
          sprites.x = Phaser.Math.Linear(sprites.x, position.x, 0.2);
        }
        if (sprites.y !== position.y) {
          sprites.y = Phaser.Math.Linear(sprites.y, position.y, 0.2);
        }
      }
    });

    container.query(['tag-player', 'pointer', 'position']).forEach((entity) => {
      const position = entity.get<Position>('position');
      const pointer = entity.get<Pointer>('pointer');
      const vector = getVelocityByVector(position, pointer);

      if (isInTheSamePosition(position, pointer, 20)) {
        scene.room.send(TransportEventTypes.Move, [0, 0]);
        entity.removeComponent(pointer);

        return;
      }

      if (position.x !== pointer.lastX || position.y !== pointer.lastY) {
        pointer.lastX = position.x;
        pointer.lastY = position.y;

        scene.room.send(TransportEventTypes.Move, [vector.x, vector.y]);
      }
    });
  }
}
