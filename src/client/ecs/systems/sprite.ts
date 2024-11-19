import { System } from '@client/core/ecs/system';
import { ECSContainer } from '@client/core/ecs';
import { PositionComponent } from '@client/ecs/components/physics/position';
import { SpriteComponent } from '@client/ecs/components/game/sprite';
import { BodyComponent } from '@client/ecs/components/physics/body';
import { AsepriteAssetComponent } from '@client/ecs/components/game/aseprite-asset';
import { SpriteAssetComponent } from '@client/ecs/components/game/sprite-asset';

export class SpriteSystem extends System {
  constructor() {
    super('sprite');
  }

  onUpdate(scene: Phaser.Scene, container: ECSContainer): void {
    container.query(['sprite']).forEach((entity) => {
      const asset =
        entity.get<AsepriteAssetComponent>('aseprite-asset') || entity.get<SpriteAssetComponent>('sprite-asset');
      const position = entity.get<PositionComponent>('position');
      const sprite = entity.get<SpriteComponent>('sprite');
      const body = entity.get<BodyComponent>('body');

      if (position && !sprite.sprite && asset.loaded) {
        sprite.sprite = scene.add.sprite(
          position.x,
          position.y,
          asset instanceof AsepriteAssetComponent ? undefined : asset.key,
        );
        sprite.sprite.setOrigin(
          body.pivotX ? body.pivotX / body.width : 0,
          body.pivotY ? body.pivotY / body.height : 0,
        );

        if (asset instanceof AsepriteAssetComponent) {
          sprite.sprite.anims.createFromAseprite(asset.key);
        }
      }

      if (sprite.sprite) {
        sprite.sprite.depth = sprite.sprite.y + sprite.sprite.height / 2;
      }
    });
  }
}
