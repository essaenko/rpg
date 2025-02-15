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

export class MovementSystem extends System {
  constructor() {
    super('movement');
  }

  onUpdate(scene: WorldScene, container: ECSContainer, delta: number): void {
    const players = Array.from(container.query(['tag-player', 'pointer', 'position']));
    const localPlayer = container.getEntity(scene.room?.sessionId);
    container.query(['position']).forEach((entity) => {
      const position = entity.get<Position>('position');
      const { sprites } = entity.get<Appearance>('appearance') ?? {};

      if (position && sprites) {
        if (localPlayer === entity && isInTheSamePosition(position, sprites, SERVER_POSITION_TOLERANCE)) {
          return;
        }

        if (sprites.x !== position.x) {
          sprites.x = Phaser.Math.Linear(sprites.x, position.x, DEFAULT_LERP_VALUE);
          // sprites.x = position.x;
        }
        if (sprites.y !== position.y) {
          sprites.y = Phaser.Math.Linear(sprites.y, position.y, DEFAULT_LERP_VALUE);
          // sprites.y = position.y;
        }
      }
    });

    if (players.includes(localPlayer)) {
      const position = localPlayer.get<Position>('position');
      const pointer = localPlayer.get<Pointer>('pointer');
      const speed = localPlayer.get<Speed>('speed');
      const { sprites } = localPlayer.get<Appearance>('appearance') ?? {};
      const angle = Phaser.Math.Angle.BetweenPoints(position, pointer);

      if (sprites && angle && speed) {
        const vector = {
          x: angle ? Math.cos(angle) : 0,
          y: angle ? Math.sin(angle) : 0,
        };
        sprites.x += vector.x * (speed.speed * DEFAULT_SPEED) * delta;
        sprites.y += vector.y * (speed.speed * DEFAULT_SPEED) * delta;
      }
    }

    players.forEach((entity) => {
      const position = entity.get<Position>('position');
      const pointer = entity.get<Pointer>('pointer');
      const angle = Phaser.Math.Angle.BetweenPoints(position, pointer);

      if (isInTheSamePosition(position, pointer, SERVER_POSITION_TOLERANCE)) {
        scene.room.send(TransportEventTypes.Move, [null]);
        entity.remove(pointer);

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
