import { TransportEventTypes } from '@shared/types';
import { System } from '@client/core/ecs/system';
import { NetworkScene } from '@client/core/scene/network-scene';
import { clientKeyToServerValue, Keys, ServerKeyValues } from '@client/utils/types';
import { equal } from '@client/utils/array';

import Key = Phaser.Input.Keyboard.Key;

export class InputSystem extends System {
  private mappings: Map<string, Key[]>;
  private prevUpdate: ServerKeyValues[] = [];
  constructor(
    private scene: NetworkScene,
    map?: Record<Partial<Keys>, number[]>,
  ) {
    super('input');

    const mapping: Record<string, number[]> = {
      up: [Phaser.Input.Keyboard.KeyCodes.W, Phaser.Input.Keyboard.KeyCodes.UP],
      down: [Phaser.Input.Keyboard.KeyCodes.S, Phaser.Input.Keyboard.KeyCodes.DOWN],
      left: [Phaser.Input.Keyboard.KeyCodes.A, Phaser.Input.Keyboard.KeyCodes.LEFT],
      right: [Phaser.Input.Keyboard.KeyCodes.D, Phaser.Input.Keyboard.KeyCodes.RIGHT],
      ...map,
    };
    this.mappings = new Map();
    for (const key in mapping) {
      const keys = [];

      for (const code of mapping[key]) {
        keys.push(scene.input.keyboard.addKey(code));
      }

      this.mappings.set(key, keys);
    }
  }

  isDown(key: string): boolean {
    const codes = this.mappings.get(key);

    return codes !== null && codes.some((code) => code.isDown);
  }

  onUpdate(): void {
    if (!this.scene.room) return;

    let keys: ServerKeyValues[] = [];

    this.mappings.keys().forEach((key) => {
      if (this.isDown(key)) {
        keys.push(clientKeyToServerValue(key as Keys));
      }
    });

    if (!equal(keys, this.prevUpdate)) {
      this.scene.room.send(TransportEventTypes.Move, keys);

      this.prevUpdate = keys;
    }
  }
}
