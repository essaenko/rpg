import { NetworkScene } from './network-scene';
import { isMapBundleKey, map } from '@client/assets/tilesets/map';
import Tilemap = Phaser.Tilemaps.Tilemap;
import { IN_GAME_DAY_TIME } from '@client/utils/const';
import { TransportEventTypes } from '@shared/types';
import { nanoid } from 'nanoid';
import { Entity } from '../ecs/entity/entity';
import { Position } from '@client/ecs/components/physics/position';
import { MapObject } from '@client/ecs/components/game/tag/mapObject';

export class WorldScene extends NetworkScene {
  constructor(
    public name: string,
    private debugCollider: boolean = false,
  ) {
    super(name);
  }

  private map: Tilemap;

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

    if (isMapBundleKey(name)) {
      const bundle = map[name];
      this.map = this.make.tilemap({ key: bundle.map.key });

      bundle.assets.forEach((asset) => {
        this.map.addTilesetImage(asset.key, asset.key);
      });

      this.map.layers
        .filter((layer) => layer.visible)
        .forEach((layer) => {
          this.map
            .createLayer(
              layer.name,
              bundle.assets.map(({ key }) => key),
            )
            .setPipeline('Light2D');
        });

      if (this.debugCollider) {
        this.map.createLayer('collision', ['world-tile']);

        const g = this.add.graphics();

        g.lineStyle(2, 0xff00ff, 1);
        g.strokeRect(0, 0, this.map.width * this.map.tileWidth, this.map.height * this.map.tileHeight);
      }
      if (this.map.tilesets.some((set) => set.tileData)) {
        this.initTilesetAnimations();
      }

      this.addLight();

      if (!this.room) {
        this.onJoin = () => {
          this.room.send(TransportEventTypes.GetObjects);
        };
      } else {
        this.room.send(TransportEventTypes.GetObjects);
      }

      this.initStaticObjects();
      this.handleTileMapAnimations();
    }
  }

  adjustCamera() {
    this.cameras.main.setZoom(this.scale.width / 1280);
    this.cameras.main.setRoundPixels(true);
  }

  addLight() {
    this.lights.enable();

    const color = {
      day: Phaser.Display.Color.ValueToColor(0x2a2a55),    // ночь
      night: Phaser.Display.Color.ValueToColor(0xfbf3d5),  // день
    };

    const fn = () => {
      const now = new Date();
      const minute = now.getMinutes();
      const second = now.getSeconds();
      const total = minute * 60 + second;
      const inCycle = total % 3600;
      const isDay = inCycle < 1800;
      const cyclePos = isDay
        ? 100 - (inCycle / 1800) * 100
        : ((inCycle - 1800) / 1800) * 100;
      const colorObj = Phaser.Display.Color.Interpolate.ColorWithColor(
        color.day,
        color.night,
        100,
        cyclePos
      );
      this.lights.lights.forEach((light) => {
        light.setIntensity(1.5 * (1 - cyclePos / 100));
      });

      this.lights.setAmbientColor(
        Phaser.Display.Color.GetColor(colorObj.r, colorObj.g, colorObj.b)
      );


    };

    // обновляем освещение раз в секунду
    this.time.addEvent({
      delay: 1000,
      loop: true,
      callback: fn,
    });

    fn(); // сразу отобразить актуальное состояние
  }

  update(now: number, delta: number) {
    super.update(now, delta);
  }

  handleTileMapAnimations() {
    for (const layer of this.map.layers.filter(({ visible }) => visible)) {
      const tilesets = layer.tilemapLayer.tileset;

      for (const tileset of tilesets) {
        const animationKeys = Object.entries(tileset.tileData)
          .filter(([_, data]) => data.animation && !data.objectgroup)
          .map(([key]) => +key);
        for (const key of animationKeys) {
          const sprites = layer.tilemapLayer.createFromTiles(+key + tileset.firstgid, -1);

          for (const sprite of sprites) {
            sprite.setTexture(tileset.name, key);
            sprite.setPipeline('Light2D');
            sprite.play(`${tileset.name}-animation-${key + +tileset.firstgid}`);
          }
        }
      }
    }
  }

  initTilesetAnimations() {
    this.map.tilesets
      .filter((set) => Object.keys(set.tileData).length)
      .forEach((tileset) => {
        const data = tileset.tileData as Record<string, { animation?: { duration: number; tileid: number }[] }>;

        for (const tileId in data) {
          const tile = data[tileId];

          if (tile.animation && !this.anims.exists(`${tileset.name}-animation-${+tileId + +tileset.firstgid}`)) {
            const frames = tile.animation.map(({ duration, tileid }) => ({
              key: tileset.name,
              frame: tileid,
              duration,
            }));

            this.anims.create({
              key: `${tileset.name}-animation-${+tileId + +tileset.firstgid}`,
              frames: frames,
              repeat: -1,
              frameRate: 10,
            });
          }
        }
      });
  }

  initStaticObjects() {
    const objLayer = this.map.getObjectLayer('objects');

    if (objLayer) {
      objLayer.objects.forEach((obj) => {
        if (
          !obj.properties?.find(({ name, value }: { name?: string; value?: boolean }) => name === 'dynamic' && !!value)
        ) {
          const entity = new Entity(nanoid(9));
          const position = new Position();
          position.x = obj.x;
          position.y = obj.y;
          entity.add(position);

          const objCom = new MapObject();
          objCom.type = obj.type;
          objCom.gid = obj.gid;
          entity.add(objCom);

          this.ecs.addEntity(entity);
        }
      });
    }
  }
}
