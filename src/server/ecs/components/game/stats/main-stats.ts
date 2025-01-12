import { Component } from '@shared/ecs/component';
import { type } from '@colyseus/schema';

export class MainStats extends Component {
  constructor() {
    super('main-stats');
  }

  serializable = true;

  @type('number') intellect: number = 0;
  @type('number') strength: number = 0;
  @type('number') agility: number = 0;

  init(state: Record<string, any>): void {
    if ('intellect' in state) {
      this.intellect = state.intellect;
    }
    if ('strength' in state) {
      this.strength = state.strength;
    }
    if ('agility' in state) {
      this.agility = state.agility;
    }
  }
}
