import { Component } from '@shared/ecs/component';
import { type } from '@colyseus/schema';
import { Animation } from '@shared/types';

export class Appearance extends Component {
  constructor() {
    super('appearance');
  }

  serializable = true;

  @type('string') key: string;
  @type('number') animation: Animation = Animation.Idle;

  init(state: Record<string, any>): void {
    if (state.key) {
      this.key = state.key;
    }
  }
}
