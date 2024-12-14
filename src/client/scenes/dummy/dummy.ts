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
  }

  create() {
    super.create();
  }

  init() {
    this.registry.set('scene', 'dummy');
    this.registry.set('hood', true);
  }

  update(time: number, delta: number) {
    super.update(time, delta);
  }
}
