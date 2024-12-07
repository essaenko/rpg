import { System } from '@client/core/ecs/system';
import { ECSContainer } from '@client/core/ecs';
import { HealthFrameComponent } from '@client/ecs/components/game/asset/health-frame';
import { AppearanceComponent } from '@client/ecs/components/game/appearance';
import { isAssetKey, map } from '@client/assets/sprites/map';

export class LoadSystem extends System {
  constructor() {
    super('load');
  }

  onUpdate(scene: Phaser.Scene, container: ECSContainer): void {
    container.query(['appearance']).forEach((entity) => {
      const appearance = entity.get<AppearanceComponent>('appearance');

      if (scene.textures.exists(appearance.key)) {
        appearance.loaded = true;

        return;
      }

      if (!appearance.loading && !appearance.loaded) {
        const key = appearance.key;
        if (isAssetKey(key)) {
          const asset = map[key];

          switch (asset.type) {
            case 'aseprite':
              scene.load.on(`filecomplete-atlasjson-${appearance.key}`, () => {
                appearance.loaded = true;
                appearance.loading = false;
              });
              scene.load.aseprite(key, asset.asset, asset.json);
              appearance.loading = true;
              break;
          }
        }
      }
    });

    container.query(['health-frame']).forEach((entity) => {
      const hfc = entity.get<HealthFrameComponent>('health-frame');

      if (scene.textures.exists(hfc.asset.key)) {
        hfc.asset.loading = false;
        hfc.asset.loaded = true;

        return;
      }

      if (!hfc.asset.loaded && !hfc.asset.loading) {
        scene.load.spritesheet(hfc.asset.key, hfc.asset.url, hfc.asset.config);
        hfc.asset.loading = true;
      }
    });

    if (!scene.load.isLoading() && scene.load.isReady()) {
      scene.load.start();
    }
  }
}
