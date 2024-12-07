import { Component } from '@shared/ecs/component';

export class PlayerComponent extends Component {
  constructor() {
    super('tag-player');
  }

  init(state: Record<string, any>): void {}
}
