import Phaser from 'phaser';

import { System } from '@client/core/ecs/system';
import { ECSContainer } from '@client/core/ecs';
import { Position } from '@client/ecs/components/physics/position';
import { Appearance } from '@client/ecs/components/game/visual/appearance';
import { Pointer } from '@client/ecs/components/physics/pointer';
import { WorldScene } from '@client/core/scene/world-scene';
import { isInTheSamePosition } from '@shared/utils/physics';
import { TransportEventTypes } from '@shared/types';
import { DEFAULT_LERP_VALUE, SERVER_POSITION_TOLERANCE } from '@client/utils/const';
import { Speed } from '@client/ecs/components/physics/speed';
import { DEFAULT_SPEED } from '@server/utils/game/const';
import { Death } from '@client/ecs/components/game/mechanics/death';

export class MovementSystem extends System {
  constructor() {
    super('movement');
  }

  onUpdate(scene: WorldScene, container: ECSContainer, delta: number): void {
    const player = container.getEntity(scene.room?.sessionId);

    for (const it of container.query(['position'])) {
      const position = it.get<Position>('position');
      const { sprites } = it.get<Appearance>('appearance') ?? {};

      if (position && sprites) {
        if (player === it && isInTheSamePosition(position, sprites, SERVER_POSITION_TOLERANCE)) {
          break;
        }

        if (sprites.x !== position.x) {
          sprites.x = Phaser.Math.Linear(sprites.x, position.x, DEFAULT_LERP_VALUE);
        }
        if (sprites.y !== position.y) {
          sprites.y = Phaser.Math.Linear(sprites.y, position.y, DEFAULT_LERP_VALUE);
        }
      }
    }

    if (player) {
      const position = player.get<Position>('position');
      const pointer = player.get<Pointer>('pointer');
      const speed = player.get<Speed>('speed');
      const death = player.get<Death>('death');
      const { sprites } = player.get<Appearance>('appearance') ?? {};

      if (pointer) {
        const angle = Phaser.Math.Angle.BetweenPoints(position, pointer);

        if (isInTheSamePosition(position, pointer, SERVER_POSITION_TOLERANCE)) {
          scene.room.send(TransportEventTypes.Move, [null]);
          player.remove(pointer);

          return;
        }

        if (sprites && angle && speed && !death.dead) {
          const vector = {
            x: angle ? Math.cos(angle) : 0,
            y: angle ? Math.sin(angle) : 0,
          };
          sprites.x += vector.x * (speed.speed * DEFAULT_SPEED) * delta;
          sprites.y += vector.y * (speed.speed * DEFAULT_SPEED) * delta;
        }

        if (position.x !== pointer.lastX || position.y !== pointer.lastY) {
          pointer.lastX = position.x;
          pointer.lastY = position.y;

          scene.room.send(TransportEventTypes.Move, [angle]);
        }
      }
    }
  }
}
