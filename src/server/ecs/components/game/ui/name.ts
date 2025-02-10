import { Component, NetworkComponent } from '@shared/ecs/component';
import { type, view } from '@colyseus/schema';

export class Name extends NetworkComponent {
  constructor() {
    super('name');
  }

  serializable = true;

  @type('string') value: string = '';

  init(state: Record<string, any>): void {
    if ('value' in state) {
      this.value = state.value;
    }
  }
}
