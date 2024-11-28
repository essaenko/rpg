import { System } from '@client/core/ecs/system';
import { ECSContainer } from '@client/core/ecs';
import { AnimationComponent } from '@client/ecs/components/game/asset/animation';
import { SpriteComponent } from '@client/ecs/components/game/asset/sprite';

export class AnimationSystem extends System {
  constructor() {
    super('animation');
  }

  onUpdate(scene: Phaser.Scene, container: ECSContainer): void {
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
