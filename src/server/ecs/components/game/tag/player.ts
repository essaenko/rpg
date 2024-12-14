import { Component } from '@shared/ecs/component';

export class Player extends Component {
  constructor() {
    super('tag-player');
  }

  serializable = true;

  init(state: Record<string, any>): void {}
}
