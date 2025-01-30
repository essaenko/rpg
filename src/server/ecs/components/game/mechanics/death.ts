import { type } from '@colyseus/schema';
import { Component } from '@shared/ecs/component';

export class Death extends Component {
  init(state: Record<string, any>): void {}
  constructor() {
    super('death');
  }

  @type('boolean') dead: boolean = false;
}
