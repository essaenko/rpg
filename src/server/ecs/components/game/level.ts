import { Component } from '@shared/ecs/component';
import { type } from '@colyseus/schema';

export class Level extends Component {
  constructor() {
    super('level');
  }

  serializable = true;

  @type('number') level: number = 1;
  @type('number') exp: number = 0;

  init(state: Record<string, any>): void {
    if ('level' in state) {
      this.level = state.level;
    }
    if ('exp' in state) {
      this.exp = state.exp;
    }
  }
}
