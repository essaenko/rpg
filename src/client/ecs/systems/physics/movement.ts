import Phaser from 'phaser';

import { System } from '@client/core/ecs/system';
import { ECSContainer } from '@client/core/ecs';
import { Position } from '@client/ecs/components/physics/position';
import { Appearance } from '@client/ecs/components/game/visual/appearance';
import { Pointer } from '@client/ecs/components/physics/pointer';
import { WorldScene } from '@client/core/scene/world-scene';
import { isInTheSamePosition } from '@shared/utils/physics';
import { TransportEventTypes } from '@shared/types';
import { DEFAULT_LERP_VALUE } from '@client/utils/const';

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
          sprites.x = Phaser.Math.Linear(sprites.x, position.x, DEFAULT_LERP_VALUE);
        }
        if (sprites.y !== position.y) {
          sprites.y = Phaser.Math.Linear(sprites.y, position.y, DEFAULT_LERP_VALUE);
        }
      }
    });

    container.query(['tag-player', 'pointer', 'position']).forEach((entity) => {
      const position = entity.get<Position>('position');
      const pointer = entity.get<Pointer>('pointer');
      const angle = Phaser.Math.Angle.BetweenPoints(position, pointer);

      if (isInTheSamePosition(position, pointer, 5)) {
        scene.room.send(TransportEventTypes.Move, [null]);
        entity.removeComponent(pointer);

        return;
      }

      if (position.x !== pointer.lastX || position.y !== pointer.lastY) {
        pointer.lastX = position.x;
        pointer.lastY = position.y;

        scene.room.send(TransportEventTypes.Move, [angle]);
      }
    });
  }
}
