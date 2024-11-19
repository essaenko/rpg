import { Component } from '@shared/ecs/component';
import { type } from '@colyseus/schema';

export class HealthComponent extends Component {
  constructor() {
    super('health');
  }

  @type('number') max: number = 0;
  @type('number') current: number = 0;

  init(state: Record<string, any>): void {
    if ('current' in state) {
      this.current = state.current;
    }

    if ('max' in state) {
      this.max = state.max;
    }
  }
}
