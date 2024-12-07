import { Component } from '@shared/ecs/component';
import { type } from '@colyseus/schema';

export class HealComponent extends Component {
  constructor() {
    super('heal');
  }

  @type('number') value: number;

  init(state: Record<string, any>): void {}
}
