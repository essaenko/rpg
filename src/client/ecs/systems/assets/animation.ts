import { System } from '@client/core/ecs/system';
import { ECSContainer } from '@client/core/ecs';
import { AnimationComponent } from '@client/ecs/components/game/asset/animation';
import { SpriteComponent } from '@client/ecs/components/game/asset/sprite';
import { AppearanceComponent } from '@client/ecs/components/game/appearance';
import Sprite = Phaser.Physics.Arcade.Sprite;
import { getAnimationConfig, getAnimationKey } from '@client/utils/animation';

export class AnimationSystem extends System {
  constructor() {
    super('animation');
  }

  onUpdate(scene: Phaser.Scene, container: ECSContainer): void {
    container.query(['appearance']).forEach((entity) => {
      const appearance = entity.get<AppearanceComponent>('appearance');

      if (appearance.sprites !== undefined && appearance.animation) {
        appearance.sprites.each((sprite: Sprite) => {
          sprite.play(
            {
              ...getAnimationConfig(appearance.animation),
              key: getAnimationKey(appearance.animation),
            },
            true,
          );
        });
      }
    });
    container.query(['animation', 'sprite']).forEach((entity) => {
      const animation = entity.get<AnimationComponent>('animation');
      const sprite = entity.get<SpriteComponent>('sprite');

      if (sprite.sprite !== undefined && (animation.key || animation.config)) {
        if (animation.key !== sprite.sprite.anims.currentAnim?.key) {
          sprite.sprite.play(animation.key ?? animation.config, true);
        }
      }
    });
  }
}
