import { Component } from '@shared/ecs/component';

export class ObjectComponent extends Component {
  constructor() {
    super('tag-object');
  }

  init(state: Record<string, any>): void {}
}
