import { TransportEventTypes } from '@shared/types';
import { System } from '@client/core/ecs/system';
import { NetworkScene } from '@client/core/scene/network-scene';
import { clientKeyToServerValue, Keys, ServerKeyValues } from '@client/utils/types';
import { equal } from '@client/utils/array';

import Key = Phaser.Input.Keyboard.Key;
import { InputService } from '@client/services/input';
import { TargetComponent } from '@client/ecs/components/game/combat/target';

export class InputSystem extends System {
  private prevMoveUpdate: ServerKeyValues[] = [];
  private prevCastUpdate: Keys | null = null;
  constructor(
    private scene: NetworkScene,
    map?: Record<Partial<Keys>, number[]>,
  ) {
    super('input');
  }

  onUpdate(): void {
    if (!this.scene.room) return;

    const castKey: Keys = [
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
    ].find((key) => InputService.instance().isPressed(key));
    const moveKeys = [Keys.Up, Keys.Down, Keys.Left, Keys.Right]
      .filter((key) => InputService.instance().isPressed(key))
      .map(clientKeyToServerValue);

    if (!equal(moveKeys, this.prevMoveUpdate)) {
      this.scene.room.send(TransportEventTypes.Move, moveKeys);

      this.prevMoveUpdate = moveKeys;
    }
    if (castKey !== this.prevCastUpdate) {
      if (castKey) {
        const spell = InputService.instance().getSpellBinding(castKey);
        const target = this.scene.ecs.getEntity(this.scene.room.sessionId).get<TargetComponent>('target');
        if (spell && target) {
          this.scene.room.send(TransportEventTypes.CastRequest, [spell, target.target]);
        }
      }

      this.prevCastUpdate = castKey;
    }
  }
}
