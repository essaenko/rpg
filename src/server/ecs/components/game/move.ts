import { type } from '@colyseus/schema';
import { Component } from '@shared/ecs/component';

export class Move extends Component {
  constructor() {
    super('move');
  }

  @type('boolean') empty = true;

  serializable = true;

  public angle: number = null;

  init(state: Record<string, any>): void {}

  serialize(): Record<string, any> {
    return {
      name: this.name,
    };
  }
}
