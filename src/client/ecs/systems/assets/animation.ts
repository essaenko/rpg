import { System } from '@client/core/ecs/system';
import { ECSContainer } from '@client/core/ecs';
import { Animation } from '@client/ecs/components/game/asset/animation';
import { Sprite } from '@client/ecs/components/game/asset/sprite';
import { Appearance } from '@client/ecs/components/game/appearance';
import ArcadeSprite = Phaser.Physics.Arcade.Sprite;
import { getAnimationConfig, getAnimationKey } from '@client/utils/animation';

export class AnimationSystem extends System {
  constructor() {
    super('animation');
  }

  onUpdate(scene: Phaser.Scene, container: ECSContainer): void {
    container.query(['appearance']).forEach((entity) => {
      const appearance = entity.get<Appearance>('appearance');

      if (appearance.sprites !== undefined && appearance.animation) {
        const key = getAnimationKey(appearance.animation);
        const config = getAnimationConfig(appearance.animation);
        appearance.sprites.each((sprite: ArcadeSprite) => {
          if (sprite.anims?.exists(key)) {
            sprite.play(
              {
                ...config,
                key,
              },
              true,
            );
          }
        });
      }
    });
    container.query(['animation', 'sprite']).forEach((entity) => {
      const animation = entity.get<Animation>('animation');
      const sprite = entity.get<Sprite>('sprite');

      if (sprite.sprite !== undefined && (animation.key || animation.config)) {
        if (animation.key !== sprite.sprite.anims.currentAnim?.key) {
          sprite.sprite.play(animation.key ?? animation.config, true);
        }
      }
    });
  }
}
