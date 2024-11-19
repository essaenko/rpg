import { Room } from 'colyseus.js';

import DummyTileSet from '@client/assets/tilesets/dummy-tile.png';

import { NetworkScene } from './network-scene';

export class WorldScene extends NetworkScene {
  constructor(
    public name: string,
    private debugCollider: boolean = false,
  ) {
    super(name);
  }

  preload() {
    this.load.image('dummy-tile', DummyTileSet);
  }

  async create() {
    await super.create();

    this.initRoom(this.room);
  }

  initRoom(room: Room | undefined) {
    if (room && room instanceof Room) {
      this.createMap();
    } else {
      this.add.text(10, 10, `Can't connect to server room`, {
        fontSize: 14,
        color: 'white',
      });
    }
  }

  createMap() {
    const map = this.make.tilemap({ key: `${this.name}-scene-map` });
    map.addTilesetImage('ground', 'fl-ground-tileset');
    map.addTilesetImage('hills', 'fl-hills-tileset');
    map.addTilesetImage('dummy-tile', 'dummy-tile');

    map.createLayer('ground', ['ground', 'hills']);
    map.createLayer('hills', ['ground', 'hills']);

    if (this.debugCollider) {
      map.createLayer('collision', ['dummy-tile']);

      const g = this.add.graphics();

      g.lineStyle(2, 0xff00ff, 1);
      g.strokeRect(0, 0, map.width * map.tileWidth, map.height * map.tileHeight);
    }
  }

  update(now: number, delta: number) {
    super.update(now, delta);
  }
}
