import { Component } from '@shared/ecs/component';
import { type } from '@colyseus/schema';

export class DamageComponent extends Component {
  constructor() {
    super('damage');
  }

  @type('number') value: number;
  init(state: Record<string, any>): void {}
}
