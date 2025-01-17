import { NetworkScene } from './network-scene';
import { isMapBundleKey, map } from '@client/assets/tilesets/map';
import Tilemap = Phaser.Tilemaps.Tilemap;
import { IN_GAME_DAY_TIME } from '@client/utils/const';

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
    const name = this.name;

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
    const name = this.name;
    this.adjustCamera();
    this.addLight();

    if (isMapBundleKey(name)) {
      const bundle = map[name];
      const phaserMap = this.make.tilemap({ key: bundle.map.key });
      bundle.assets.forEach((asset) => {
        phaserMap.addTilesetImage(asset.key, asset.key);
      });

      phaserMap.layers
        .filter((layer) => layer.visible)
        .forEach((layer) => {
          phaserMap
            .createLayer(
              layer.name,
              bundle.assets.map(({ key }) => key),
            )
            .setPipeline('Light2D');
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

  adjustCamera() {
    this.cameras.main.setZoom(this.scale.width / 1280);
    this.cameras.main.setRoundPixels(true);
  }

  addLight() {
    this.lights.enable();
    this.lights.setAmbientColor(0xfbf3d5);
    const color = {
      day: Phaser.Display.Color.ValueToColor(0x2a2a55),
      night: Phaser.Display.Color.ValueToColor(0xfbf3d5),
    };

    const now = new Date();
    const fn = (tween: { getValue: () => number }) => {
      const value = tween.getValue();
      const colorObj = Phaser.Display.Color.Interpolate.ColorWithColor(color.day, color.night, 100, value);
      this.lights.setAmbientColor(Phaser.Display.Color.GetColor(colorObj.r, colorObj.g, colorObj.b));
      this.lights.lights.forEach((light) => {
        light.setIntensity(1.5 * (1 - value / 100));
      });
    };

    this.tweens.addCounter({
      from: (now.getMinutes() / 60) * 100,
      to: 100,
      ease: Phaser.Math.Easing.Sine.InOut,
      duration: (60 - now.getMinutes()) * 60 * 1000,
      repeat: 1,
      onComplete: () => {
        this.tweens.addCounter({
          from: 0,
          to: 100,
          ease: Phaser.Math.Easing.Sine.InOut,
          duration: IN_GAME_DAY_TIME,
          repeat: -1,
          yoyo: true,
          onUpdate: fn,
        });
      },
      onUpdate: fn,
    });
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
