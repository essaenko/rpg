import { Component } from '@shared/ecs/component';
import { type } from '@colyseus/schema';

export class ObjectComponent extends Component {
  constructor() {
    super('tag-object');
  }

  @type('string') type: string;
  @type('number') gid: number;

  init(state: Record<string, any>): void {}
}
