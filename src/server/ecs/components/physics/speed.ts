import { type } from '@colyseus/schema';
import { Component, NetworkComponent } from '@shared/ecs/component';

export class Speed extends NetworkComponent {
  constructor() {
    super('speed');
  }
  @type('boolean') empty = true;
  serializable = true;

  @type('number') speed: number = 0; // 1

  init(state: Record<string, any>): void {
    if ('speed' in state) {
      this.speed = state.speed;
    }
  }
}
