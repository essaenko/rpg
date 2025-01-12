import { System } from '@client/core/ecs/system';
import { WorldScene } from '@client/core/scene/world-scene';
import { ECSContainer } from '@client/core/ecs';
import { Appearance } from '@client/ecs/components/game/appearance';
import { Position } from '@client/ecs/components/physics/position';
import { Target } from '@client/ecs/components/game/combat/target';
import { Body } from '@client/ecs/components/physics/body';
import { QuestGiverState } from '@client/ecs/components/game/quest/quest-giver-state';
import ArcadeSprite = Phaser.Physics.Arcade.Sprite;
import { Action } from '@client/ecs/components/game/action';
import { HealthFrame } from '@client/ecs/components/game/asset/health-frame';
import Sprite = Phaser.Physics.Arcade.Sprite;

export class AppearanceSystem extends System {
  constructor() {
    super('appearance');
  }
  onUpdate(scene: WorldScene, container: ECSContainer): void {
    container.query(['appearance']).forEach((entity) => {
      const appearance = entity.get<Appearance>('appearance');
      const position = entity.get<Position>('position');
      const body = entity.get<Body>('body');

      if (appearance.loaded && !appearance.sprites) {
        appearance.sprites = scene.add.container(position.x, position.y);

        const sprite = scene.physics.add.sprite(0, 0, undefined);
        sprite.anims.createFromAseprite(appearance.key);

        appearance.sprites.add(sprite);
        appearance.sprites.setSize(body.width, body.height);
        appearance.sprites.setInteractive();
        const highlightAction = new Action();
        highlightAction.action = () => {
          const player = container.getEntity(scene.room.sessionId);
          player?.removeComponent('target');
          container.query(['target-highlight']).forEach((entity) => {
            entity.removeComponent('target-highlight');
          });
          const target = new Target();
          target.target = entity.id;
          player?.addComponent(target);
        };
        entity.addComponent(highlightAction);

        appearance.sprites.on('pointerdown', () => {
          const actions = entity.getAll<Action>('action');

          actions.forEach((action) => {
            action.action();
          });
        });
      }

      if (appearance.sprites) {
        appearance.sprites.depth = position.y + body.height / 2;
      }
    });

    container.query(['appearance', 'quest-giver-state']).forEach((entity) => {
      const appearance = entity.get<Appearance>('appearance');
      const state = entity.get<QuestGiverState>('quest-giver-state');

      if (state.state && appearance.sprites) {
        let sprite = appearance.sprites.getByName('quest-giver-state') as ArcadeSprite;
        let y = -state.asset.config.frameHeight * 1.5;
        if (sprite && sprite instanceof ArcadeSprite && sprite.state !== state.state) {
          appearance.sprites.remove(sprite);
          sprite.destroy(true);
        }

        if (!sprite && state.asset.loaded) {
          if (appearance.sprites.getByName('health-frame')) {
            y -= 15;
          }
          sprite = scene.physics.add.sprite(0, y, state.asset.key, state.state - 1);
          sprite.name = 'quest-giver-state';
          sprite.state = state.state;
          sprite.depth = 1;

          appearance.sprites.add(sprite);
        }

        if (sprite) {
          appearance.sprites.moveTo(sprite, appearance.sprites.length - 1);

          if ((appearance.sprites.getByName('health-frame') as Sprite)?.visible) {
            y -= 15;
          }
          sprite.y = y;
        }
      }
    });
  }
}
