import { ECSContainer } from '@client/core/ecs';
import { System } from '@client/core/ecs/system';
import { Appearance } from '@client/ecs/components/game/visual/appearance';
import { Sprite } from '@client/ecs/components/game/visual/sprite';
import { Action } from '@client/ecs/components/game/mechanics/action';
import Pointer = Phaser.Input.Pointer;

export class ActionSystem extends System {
  constructor() {
    super('action');
  }

  onUpdate(scene: Phaser.Scene, container: ECSContainer): void {
    container.query(['action', 'interactable-object', 'sprite']).forEach((entity) => {
      const sprite = entity.get<Sprite>('sprite');

      if (!sprite.sprite) {
        return;
      }

      if (!sprite.sprite.input) {
        sprite.sprite.setInteractive({
          pixelPerfect: true,
          alphaTolerance: 1,
        });
        sprite.sprite.on('pointerdown', (pointer: Pointer) => {
          if (pointer.leftButtonDown()) {
            entity.getAll<Action>('action').forEach((action) => {
              action.action();
            });
          }
        });
      }
    });
    container.query(['action', 'appearance']).forEach((entity) => {
      const appearance = entity.get<Appearance>('appearance');

      const sprite = appearance.sprites?.getByName('body');

      if (sprite && !sprite.input) {
        sprite.setInteractive({
          pixelPerfect: true,
          alphaTolerance: 1,
        });
        sprite.on('pointerdown', (pointer: Pointer) => {
          if (pointer.leftButtonDown()) {
            entity.getAll<Action>('action').forEach((action) => {
              action.action();
            });
          }
        });
      }
    });
  }
}
