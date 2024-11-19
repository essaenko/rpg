import { Component } from '@shared/ecs/component';

export class HotComponent extends Component {
  constructor() {
    super('hot');
  }

  init(state: Record<string, any>): void {
    //TODO Add init handle
  }
}
