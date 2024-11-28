import { WorldScene } from '@client/core/scene/world-scene';

export class Dummy extends WorldScene {
  constructor() {
    super('dummy');
  }

  init() {
    this.registry.set('scene', 'dummy');
  }

  update(time: number, delta: number) {
    super.update(time, delta);
  }
}
