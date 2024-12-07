import { WorldScene } from '@client/core/scene/world-scene';
import CharacterTest from '@client/assets/sprites/dummy/character-test.png';
import BoarTest from '@client/assets/sprites/dummy/boar-test.png';
import DogTest from '@client/assets/sprites/dummy/dog-test.png';
import BossTest from '@client/assets/sprites/dummy/boss-test.png';

export class Dummy extends WorldScene {
  constructor() {
    super('dummy');
  }

  preload(): void {
    super.preload();
    this.load.spritesheet('character-test', CharacterTest, {
      frameWidth: 64,
      frameHeight: 64,
    });
    this.load.spritesheet('boar-test', BoarTest, {
      frameWidth: 64,
      frameHeight: 48,
    });
    this.load.spritesheet('dog-test', DogTest, {
      frameWidth: 64,
      frameHeight: 48,
    });
    this.load.spritesheet('boss-test', BossTest, {
      frameWidth: 256,
      frameHeight: 256,
      startFrame: 0,
      endFrame: 14,
    });
  }

  create() {
    super.create();
    // this.add.sprite(395, 274, 'character-test');
    // this.add.sprite(475, 320, 'boar-test');
    // this.add.sprite(410, 300, 'dog-test');
    const boss = this.add.sprite(395, 274, 'boss-test');
    boss.anims.create({
      key: 'idle',
      frames: 'boss-test',
      repeat: -1,
      frameRate: 10,
    });
    boss.anims.play('idle');
  }

  init() {
    this.registry.set('scene', 'dummy');
    this.registry.set('hood', true);
  }

  update(time: number, delta: number) {
    super.update(time, delta);
  }
}
