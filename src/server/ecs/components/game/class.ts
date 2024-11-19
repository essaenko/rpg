import { Component } from '@shared/ecs/component';
import { type } from '@colyseus/schema';
import { Class } from '@shared/types';

export class ClassComponent extends Component {
  constructor() {
    super('class');
  }

  @type('string') class: Class = null;

  init(state: Record<string, any>): void {
    if ('class' in state) {
      this.class = state.class;
    }
  }
}
