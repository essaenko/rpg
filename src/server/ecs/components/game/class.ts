import { Component } from '@shared/ecs/component';
import { type } from '@colyseus/schema';
import { Class as Classes } from '@shared/types';

export class Class extends Component {
  constructor() {
    super('class');
  }

  serializable = true;

  @type('number') class: Classes;

  init(state: Record<string, any>): void {
    if ('class' in state) {
      this.class = state.class;
    }
  }
}
