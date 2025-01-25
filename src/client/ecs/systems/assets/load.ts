import { System } from '@client/core/ecs/system';
import { ECSContainer } from '@client/core/ecs';
import { Appearance } from '@client/ecs/components/game/visual/appearance';
import { isAssetKey, map } from '@client/assets/sprites/map';
import { QuestGiverState } from '@client/ecs/components/game/quest/quest-giver-state';

export class LoadSystem extends System {
  constructor() {
    super('load');
  }

  onUpdate(scene: Phaser.Scene, container: ECSContainer): void {
    container.query(['appearance']).forEach((entity) => {
      const appearance = entity.get<Appearance>('appearance');

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

    container.query(['quest-giver-state']).forEach((entity) => {
      const qgs = entity.get<QuestGiverState>('quest-giver-state');

      if (scene.textures.exists(qgs.asset.key)) {
        qgs.asset.loading = false;
        qgs.asset.loaded = true;

        return;
      }

      if (!qgs.asset.loaded && !qgs.asset.loading) {
        scene.load.spritesheet(qgs.asset.key, qgs.asset.url, qgs.asset.config);
        qgs.asset.loading = true;
      }
    });

    if (!scene.load.isLoading() && scene.load.isReady()) {
      scene.load.start();
    }
  }
}
