import { Component } from '@shared/ecs/component';
import { type } from '@colyseus/schema';

export class MapObject extends Component {
  constructor() {
    super('tag-object');
  }

  serializable = true;

  @type('string') type: string;
  @type('number') gid: number;

  init(state: Record<string, any>): void {}
}
