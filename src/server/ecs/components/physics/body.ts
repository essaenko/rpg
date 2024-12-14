import { Component } from '@shared/ecs/component';
import { type } from '@colyseus/schema';

export class Body extends Component {
  constructor() {
    super('body');
  }

  serializable = true;

  @type('number') width: number = 0;
  @type('number') height: number = 0;
  @type('number') pivotX: number = 0;
  @type('number') pivotY: number = 0;

  init(state: Record<string, any>): void {
    if ('width' in state) {
      this.width = state.width;
    }
    if ('height' in state) {
      this.height = state.height;
    }
    if ('pivotX' in state) {
      this.pivotX = state.pivotX;
    }
    if ('pivotY' in state) {
      this.pivotY = state.pivotY;
    }
  }
}
