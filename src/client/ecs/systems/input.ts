import { TransportEventTypes } from '@shared/types';
import { System } from '@client/core/ecs/system';
import { Keys, SpellPanel } from '@client/utils/types';

import { InputService } from '@client/services/input';
import { Target } from '@client/ecs/components/game/combat/target';
import { WorldScene } from '@client/core/scene/world-scene';
import { ECSContainer } from '@client/core/ecs';
import { Pointer } from '@client/ecs/components/physics/pointer';
import { Cast } from '@client/ecs/components/game/spells/cast';

export class InputSystem extends System {
  private prevCastUpdate: Keys | null = null;
  constructor() {
    super('input');
  }

  onUpdate(scene: WorldScene, container: ECSContainer): void {
    if (!scene.room) return;
    const player = container.getEntity(scene.room.sessionId);

    const castKey: Keys =
      (Object.keys(Keys).find((key) => InputService.instance().isPressed(key as Keys)) as Keys) ?? null;
    if (castKey !== this.prevCastUpdate) {
      const spell = InputService.instance().getSpellBinding(castKey);
      const target = container.getEntity(scene.room.sessionId).get<Target>('target');

      if (spell && target) {
        scene.room.send(TransportEventTypes.CastRequest, [spell, target.target]);
        const cast = new Cast();
        cast.spellID = spell;
        container.getEntity(scene.room.sessionId).add(cast);
      }

      this.prevCastUpdate = castKey;
    }

    const cursor = scene.input.activePointer;
    if (cursor.isDown && cursor.buttons === 2) {
      cursor.updateWorldPoint(scene.cameras.main);
      if (player) {
        let pointer = player.get<Pointer>('pointer');

        if (!pointer) {
          pointer = new Pointer();
          player.add(pointer);

          pointer.on('component:destroy', () => {
            scene.room.send(TransportEventTypes.Move, [null]);
          });
        }
        pointer.x = cursor.worldX;
        pointer.y = cursor.worldY;
        pointer.lastX = null;
        pointer.lastY = null;
      }
    }

    if (InputService.instance().isPressed(Keys.KeyS)) {
      player.remove('pointer');
    }
  }
}
