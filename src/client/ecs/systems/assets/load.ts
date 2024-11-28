import { System } from '@client/core/ecs/system';
import { ECSContainer } from '@client/core/ecs';
import { AsepriteAssetComponent } from '@client/ecs/components/game/asset/aseprite-asset';
import { SpriteAssetComponent } from '@client/ecs/components/game/asset/sprite-asset';

export class LoadSystem extends System {
  constructor() {
    super('load');
  }

  onUpdate(scene: Phaser.Scene, container: ECSContainer): void {
    const spriteAssets = container.query(['sprite-asset']);
    const asepriteAssets = container.query(['aseprite-asset']);

    asepriteAssets.forEach((entity) => {
      const aseprite = entity.get<AsepriteAssetComponent>('aseprite-asset');

      if (scene.textures.exists(aseprite.key)) {
        aseprite.loaded = true;

        return;
      }

      if (scene.load)
        if (!aseprite.loading && !aseprite.loaded) {
          scene.load.on(`filecomplete-atlasjson-${aseprite.key}`, () => {
            aseprite.loaded = true;
            aseprite.loading = false;
          });
          scene.load.aseprite(aseprite.key, aseprite.texture, aseprite.atlas);
          aseprite.loading = true;
        }
    });

    spriteAssets.forEach((entity) => {
      const sprite = entity.get<SpriteAssetComponent>('sprite-asset');

      if (scene.textures.exists(sprite.key)) {
        sprite.loaded = true;

        return;
      }

      if (!sprite.loading && !sprite.loaded) {
        scene.load.on(`filecomplete-sprite-${sprite.key}`, () => {
          sprite.loaded = true;
          sprite.loading = false;
        });
        scene.load.spritesheet(sprite.key, sprite.url);
        sprite.loading = true;
      }
    });

    if (!scene.load.isLoading() && scene.load.isReady()) {
      scene.load.start();
    }
  }
}
