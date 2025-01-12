import { Component } from '@shared/ecs/component';
import { type } from '@colyseus/schema';

export class Name extends Component {
  constructor() {
    super('name');
  }

  serializable = true;

  @type('string') value: string = '';

  init(state: Record<string, any>): void {
    if ('name' in state) {
      this.name = state.name;
    }
  }
}
