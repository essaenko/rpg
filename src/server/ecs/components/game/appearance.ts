import { Component } from '@shared/ecs/component';
import { type } from '@colyseus/schema';
import { Animation } from '@shared/types';

export class AppearanceComponent extends Component {
  constructor() {
    super('appearance');
  }

  @type('string') key: string;
  @type('number') animation: Animation = null;

  init(state: Record<string, any>): void {
    if (state.key) {
      this.key = state.key;
    }
  }
}
