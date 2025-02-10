import { Component, NetworkComponent } from '@shared/ecs/component';
import { type } from '@colyseus/schema';
import { Fraction as Fractions } from '@shared/types';

export class Fraction extends NetworkComponent {
  constructor() {
    super('fraction');
  }

  serializable = true;

  @type('number') fraction: Fractions;

  init(state: Record<string, any>): void {
    if (state.fraction) {
      this.fraction = state.fraction;
    }
  }
}
