import { Component } from '@shared/ecs/component';
import { type } from '@colyseus/schema';
import { ResourceType } from '@shared/types';

export class Resource extends Component {
  constructor() {
    super('resource');
  }

  serializable = true;

  @type('number') max: number = 0;
  @type('number') current: number = 0;
  @type('number') type: ResourceType = null;

  init(state: Record<string, any>): void {
    if ('max' in state) {
      this.max = state.max;
    }
    if ('current' in state) {
      this.current = state.current;
    }
    if ('type' in state) {
      this.type = state.type;
    }
  }
}
