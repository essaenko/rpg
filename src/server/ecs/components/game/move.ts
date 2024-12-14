import { Component } from '@shared/ecs/component';
import { Directions } from '@shared/types';

export class Move extends Component {
  constructor() {
    super('move');
  }

  serializable = true;

  public vector: [number, number] = [0, 0];

  init(state: Record<string, any>): void {}

  serialize(): Record<string, any> {
    return {
      name: this.name,
    };
  }
}
