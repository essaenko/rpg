import { Component } from '@shared/ecs/component';

export class DamageComponent extends Component {
  constructor() {
    super('damage');
  }

  init(state: Record<string, any>): void {
    //TODO Add init handle
  }
}
