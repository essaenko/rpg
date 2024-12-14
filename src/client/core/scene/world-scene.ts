import { NetworkScene } from './network-scene';
import { isMapBundleKey, map } from '@client/assets/tilesets/map';
import Tilemap = Phaser.Tilemaps.Tilemap;

export class WorldScene extends NetworkScene {
  constructor(
    public name: string,
    private debugCollider: boolean = false,
  ) {
    super(name);
  }

  preload() {
    super.preload();
    this.preloadAssets();
  }

  preloadAssets() {
    const name = this.registry.get('scene');

    if (isMapBundleKey(name)) {
      const {
        map: { key, asset },
        assets,
      } = map[name];
      this.load.tilemapTiledJSON(key, asset);

      assets.forEach(({ key, asset, type, config }) => {
        if (type === 'sprite' && config) {
          this.load.spritesheet(key, asset, config);
        } else {
          this.load.image(key, asset);
        }
      });
    }
  }

  create() {
    const name = this.registry.get('scene');

    if (isMapBundleKey(name)) {
      const bundle = map[name];
      const phaserMap = this.make.tilemap({ key: bundle.map.key });
      bundle.assets.forEach((asset) => {
        phaserMap.addTilesetImage(asset.key, asset.key);
      });

      phaserMap.layers
        .filter((layer) => layer.visible)
        .forEach((layer) => {
          phaserMap.createLayer(
            layer.name,
            bundle.assets.map(({ key }) => key),
          );
        });

      if (this.debugCollider) {
        phaserMap.createLayer('collision', ['dummy-tile']);

        const g = this.add.graphics();

        g.lineStyle(2, 0xff00ff, 1);
        g.strokeRect(0, 0, phaserMap.width * phaserMap.tileWidth, phaserMap.height * phaserMap.tileHeight);
      }
      if (phaserMap.tilesets.some((set) => set.tileData)) {
        this.initTilesetAnimations(phaserMap);
      }
    }
  }

  update(now: number, delta: number) {
    super.update(now, delta);
  }

  initTilesetAnimations(m: Tilemap) {
    m.tilesets
      .filter((set) => Object.keys(set.tileData).length)
      .forEach((tileset) => {
        const data = tileset.tileData as Record<string, { animation?: { duration: number; tileid: number }[] }>;

        for (const tileId in data) {
          const tile = data[tileId];

          if (tile.animation) {
            const frames = tile.animation.map(({ duration, tileid }) => ({ key: 'tree', frame: tileid, duration }));

            this.anims.create({
              key: `${tileset.name}-animation-${tileId}`,
              frames: frames,
              repeat: -1,
            });
          }
        }
      });
  }
}
