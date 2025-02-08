import { type } from '@colyseus/schema';
import { Component } from '@shared/ecs/component';

export class Player extends Component {
  @type('boolean') empty = true;
  constructor() {
    super('tag-player');
  }

  serializable = true;

  init(state: Record<string, any>): void {}
}
