import { Component } from '@shared/ecs/component';
import { type } from '@colyseus/schema';

export class Position extends Component {
  constructor() {
    super('position');
  }
  serializable = true;

  @type('number') x: number = 0;
  @type('number') y: number = 0;

  init(state: Record<string, any>): void {
    if ('x' in state) {
      this.x = state.x;
    }
    if ('y' in state) {
      this.y = state.y;
    }
  }
}
