import { Component } from '@shared/ecs/component';

export class HealComponent extends Component {
  constructor() {
    super('heal');
  }

  init(state: Record<string, any>): void {
    //TODO Add init handle
  }
}
