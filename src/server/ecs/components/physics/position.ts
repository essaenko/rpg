import { Component, NetworkComponent } from '@shared/ecs/component';
import { type } from '@colyseus/schema';

import { Position as PositionType } from '@shared/types';

export class Position extends NetworkComponent {
  constructor() {
    super('position');
  }
  serializable = true;

  @type('number') x: number = 0;
  @type('number') y: number = 0;

  init(state: PositionType): void {
    if ('x' in state) {
      this.x = state.x;
    }
    if ('y' in state) {
      this.y = state.y;
    }
  }
}
