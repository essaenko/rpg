import { entity, type } from '@colyseus/schema';
import { Component } from '@shared/ecs/component';

@entity
export class Move extends Component {
  constructor() {
    super('move');
  }

  serializable = true;

  public angle: number = null;

  init(state: Record<string, any>): void {}

  serialize(): Record<string, any> {
    return {
      name: this.name,
    };
  }
}
