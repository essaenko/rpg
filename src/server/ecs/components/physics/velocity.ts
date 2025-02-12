import { type } from '@colyseus/schema';
import { Component } from '@shared/ecs/component';

export class Velocity extends Component {
  constructor() {
    super('velocity');
  }
  @type('boolean') empty = true;

  serializable = true;

  public x: number = 0;
  public y: number = 0;

  init(state: Record<string, any>): void {}

  serialize() {
    return {
      name: this.name,
    };
  }
}
