import { WorldScene } from '@client/core/scene/world-scene';

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
