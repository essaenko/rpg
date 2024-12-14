import { TransportEventTypes } from '@shared/types';
import { System } from '@client/core/ecs/system';
import { clientKeyToServerValue, Keys, ServerKeyValues } from '@client/utils/types';
import { equal } from '@client/utils/array';

import { InputService } from '@client/services/input';
import { Target } from '@client/ecs/components/game/combat/target';
import { WorldScene } from '@client/core/scene/world-scene';
import { ECSContainer } from '@client/core/ecs';
import { Pointer } from '@client/ecs/components/physics/pointer';

export class InputSystem extends System {
  private prevCastUpdate: Keys | null = null;
  constructor() {
    super('input');
  }

  onUpdate(scene: WorldScene, container: ECSContainer): void {
    if (!scene.room) return;

    const castKey: Keys =
      [
        Keys.Spell1,
        Keys.Spell2,
        Keys.Spell3,
        Keys.Spell4,
        Keys.Spell5,
        Keys.Spell6,
        Keys.Spell7,
        Keys.Spell8,
        Keys.Spell9,
        Keys.Spell10,
      ].find((key) => InputService.instance().isPressed(key)) ?? null;
    if (castKey !== this.prevCastUpdate) {
      const spell = InputService.instance().getSpellBinding(castKey);
      const target = container.getEntity(scene.room.sessionId).get<Target>('target');

      if (spell && target) {
        scene.room.send(TransportEventTypes.CastRequest, [spell, target.target]);
      }

      this.prevCastUpdate = castKey;
    }

    const cursor = scene.input.activePointer;
    if (cursor.isDown && cursor.buttons === 2) {
      cursor.updateWorldPoint(scene.cameras.main);
      const player = container.getEntity(scene.room.sessionId);
      let pointer = player.get<Pointer>('pointer');

      if (!pointer) {
        pointer = new Pointer();
        player.addComponent(pointer);
      }
      pointer.x = cursor.worldX;
      pointer.y = cursor.worldY;
      pointer.lastX = null;
      pointer.lastY = null;
    }
  }
}
