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

  update(time: number, delta: number) {
    super.update(time, delta);
  }
}
