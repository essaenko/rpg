import { WorldScene } from '@client/core/scene/world-scene';

export class DummyHouse extends WorldScene {
  constructor() {
    super('dummy-house');
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
