import MapURL from '@shared/maps/dummy/dummy.json?url';
import GroundTileSet from '@client/assets/tilesets/flset/ground.png';
import HillsTileSet from '@client/assets/tilesets/flset/hills.png';
import RootGreen1 from '@client/assets/tilesets/flset/root_green_1.png';
import RootGreen2 from '@client/assets/tilesets/flset/root_green_2.png';
import RootGreen3 from '@client/assets/tilesets/flset/root_green_3.png';
import { WorldScene } from '@client/core/scene/world-scene';

export class Dummy extends WorldScene {
  constructor() {
    super('dummy');
  }

  init() {
    this.registry.set('scene', 'dummy');
  }

  preload(): void {
    super.preload();

    this.load.tilemapTiledJSON('dummy-scene-map', MapURL);
    this.load.image('fl-ground-tileset', GroundTileSet);
    this.load.image('fl-hills-tileset', HillsTileSet);
    this.load.image('fl-root-green-1', RootGreen1);
    this.load.image('fl-root-green-2', RootGreen2);
    this.load.image('fl-root-green-3', RootGreen3);
  }

  async create() {
    await super.create();
  }

  update(time: number, delta: number) {
    super.update(time, delta);
  }
}
