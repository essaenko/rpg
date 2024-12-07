import { Component } from '@shared/ecs/component';
import { type } from '@colyseus/schema';
import { Fraction } from '@shared/types';

export class FractionComponent extends Component {
  constructor() {
    super('fraction');
  }

  @type('number') fraction: Fraction;

  init(state: Record<string, any>): void {
    if (state.fraction) {
      this.fraction = state.fraction;
    }
  }
}
